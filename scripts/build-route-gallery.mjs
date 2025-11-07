import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const PROJECT_ROOT = process.cwd();
const OUTPUT_DIR = `${PROJECT_ROOT}/route-gallery`;
const OUTPUT_FILE = `${OUTPUT_DIR}/gallery.html`;
const APP_TSX_PATH = `${PROJECT_ROOT}/App.tsx`;
const PACKAGE_JSON_PATH = `${PROJECT_ROOT}/package.json`;

const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;
const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;

let devServerProcess;
let serverUrl = 'http://localhost:5173'; // Default Vite port

async function startDevServer() {
    console.log('Starting development server...');
    const packageJson = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH, 'utf-8'));
    const devCommand = packageJson.scripts.dev;

    if (!devCommand) {
        throw new Error('No "dev" script found in package.json');
    }

    const [command, ...args] = devCommand.split(' ');

    devServerProcess = spawn(command, args, {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
    });

    let serverStarted = false;
    let outputBuffer = '';

    devServerProcess.stdout.on('data', (data) => {
        outputBuffer += data.toString();
        if (!serverStarted) {
            const match = outputBuffer.match(/(http:\/\/(?:localhost|127\.0\.0\.1):\d+)/);
            if (match) {
                serverUrl = match[1];
                serverStarted = true;
                console.log(`Development server detected at: ${serverUrl}`);
            }
        }
    });

    devServerProcess.stderr.on('data', (data) => {
        console.error(`Dev server stderr: ${data.toString()}`);
    });

    devServerProcess.on('error', (err) => {
        console.error('Failed to start dev server:', err);
        throw err;
    });

    devServerProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Dev server exited with code ${code}`);
        }
    });

    // Wait for server to be reachable
    let retries = 0;
    const maxRetries = 20; // 20 * 1 second = 20 seconds timeout
    while (!serverStarted && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
    }

    if (!serverStarted) {
        throw new Error('Could not detect dev server URL from output.');
    }

    // Give it a little more time to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Dev server started and reachable.');
    return serverUrl;
}

function stopDevServer() {
    if (devServerProcess) {
        console.log('Stopping development server...');
        devServerProcess.kill('SIGTERM'); // or 'SIGKILL' if SIGTERM doesn't work
    }
}

async function fetchUrl(url, method = 'HEAD', retries = 2, timeout = 10000) {
    const client = url.startsWith('https') ? https : http;
    const start = process.hrtime.bigint();

    for (let i = 0; i <= retries; i++) {
        try {
            return await new Promise((resolve, reject) => {
                const req = client.request(url, { method, timeout }, (res) => {
                    const end = process.hrtime.bigint();
                    const duration = Number(end - start) / 1_000_000; // ms
                    res.destroy(); // Close connection immediately
                    resolve({ statusCode: res.statusCode, loadTime: duration.toFixed(2) });
                });

                req.on('error', (err) => {
                    if (i < retries) {
                        console.warn(`Attempt ${i + 1}/${retries + 1} failed for ${url}: ${err.message}. Retrying...`);
                        setTimeout(() => reject(err), 1000); // Small delay before retry
                    } else {
                        reject(err);
                    }
                });

                req.on('timeout', () => {
                    req.destroy();
                    if (i < retries) {
                        console.warn(`Attempt ${i + 1}/${retries + 1} timed out for ${url}. Retrying...`);
                        setTimeout(() => reject(new Error('Request timed out')), 1000);
                    } else {
                        reject(new Error('Request timed out'));
                    }
                });

                req.end();
            });
        } catch (error) {
            if (i === retries) {
                throw error;
            }
        }
    }
}

async function discoverRoutes() {
    console.log('Discovering routes...');
    const appContent = await fs.readFile(APP_TSX_PATH, 'utf-8');
    const routes = [];
    const skippedRoutes = [];

    // Regex to find <Route path="..." element={<... />} />
    const routeRegex = /<Route\s+path="([^"]+)"(?::?\s+element={<([^ ]+)(?: \/>|\/>)})?(?:>)?/g;
    let match;

    const topLevelRoutes = []; // Routes directly under <Routes>
    const nestedRouteDefinitions = []; // Parent routes that contain <Outlet /> and define nested routes

    // First pass to find all top-level and nested route definitions
    while ((match = routeRegex.exec(appContent)) !== null) {
        const path = match[1];
        const element = match[2]; // e.g., LandingPage, ProtectedRoute, FanRoutes

        if (element && element.includes('ProtectedRoute')) {
            // This is a protected route. We'll add it to skippedRoutes with its full path later.
            // For now, we just note that its children are protected.
            // The actual path will be determined by its parent if it's a nested ProtectedRoute
            // For now, just store the path as found in App.tsx
            // We'll handle the full path for skipped routes in the final processing.
            // For now, we'll just mark the parent path as protected.
            skippedRoutes.push({ path, reason: 'Requires authentication (parent route)' });
            continue;
        }

        if (element && (element.includes('FanRoutes') || element.includes('CreatorRoutes') || element.includes('AdminRoutes'))) {
            // This is a parent route that defines nested routes in a separate file
            nestedRouteDefinitions.push({ path, component: element });
        } else {
            // This is a direct top-level route
            topLevelRoutes.push({ path, source: 'App.tsx', framework: 'React Router' });
        }
    }

    // Add direct top-level routes
    for (const route of topLevelRoutes) {
        routes.push(route);
    }

    // Process nested route definitions
    for (const parentDef of nestedRouteDefinitions) {
        const parentPath = parentDef.path;
        const componentName = parentDef.component;

        const routeFilePath = `${PROJECT_ROOT}/routes/${componentName}.tsx`;
        try {
            const routeFileContent = await fs.readFile(routeFilePath, 'utf-8');
            const nestedRouteRegex = /<Route\s+path="([^"]*)"(?::?\s+element={<([^ ]+)(?: \/>|\/>)})?(?:>)?/g;
            let nestedMatch;

            while ((nestedMatch = nestedRouteRegex.exec(routeFileContent)) !== null) {
                const nestedPath = nestedMatch[1];
                const nestedElement = nestedMatch[2];

                if (nestedElement && nestedElement.includes('Navigate')) {
                    // Skip redirect routes within nested components
                    skippedRoutes.push({ path: `${parentPath}/${nestedPath}`.replace(/\/\//g, '/'), reason: 'Redirect route' });
                    continue;
                }

                // Construct full path
                const fullPath = nestedPath === '' ? parentPath : `${parentPath}/${nestedPath}`.replace(/\/\//g, '/');
                routes.push({ path: fullPath, source: `${componentName}.tsx`, framework: 'React Router' });
            }
        } catch (error) {
            console.warn(`Could not read route file ${routeFilePath}: ${error.message}`);
            skippedRoutes.push({ path: parentPath, reason: `Could not parse nested routes from ${componentName}.tsx` });
        }
    }

    // Handle dynamic segments and deduplicate
    const finalRoutes = [];
    const finalSkippedRoutes = [];
    const seenPaths = new Set();

    for (const route of routes) {
        let displayPath = route.path;
        if (route.path.includes(':handle')) {
            displayPath = route.path.replace(':handle', 'testuser'); // Placeholder for public profile
        }
        if (route.path.includes(':conversationId')) {
            displayPath = route.path.replace(':conversationId', '123'); // Use a placeholder ID
        }

        // Ensure paths are absolute and normalized
        if (!displayPath.startsWith('/')) {
            displayPath = `/${displayPath}`;
        }
        displayPath = displayPath.replace(/\/\//g, '/'); // Remove double slashes

        if (!seenPaths.has(displayPath)) {
            finalRoutes.push({ ...route, path: displayPath });
            seenPaths.add(displayPath);
        }
    }

    // Process skipped routes to ensure full paths and deduplicate
    for (const skipped of skippedRoutes) {
        let displayPath = skipped.path;
        if (skipped.path.includes(':handle')) {
            displayPath = skipped.path.replace(':handle', 'testuser');
        }
        if (skipped.path.includes(':conversationId')) {
            displayPath = skipped.path.replace(':conversationId', '123');
        }
        if (!displayPath.startsWith('/')) {
            displayPath = `/${displayPath}`;
        }
        displayPath = displayPath.replace(/\/\//g, '/');

        if (!seenPaths.has(displayPath)) { // Avoid adding a skipped route if it's already a final route
            finalSkippedRoutes.push({ ...skipped, path: displayPath });
            seenPaths.add(displayPath);
        }
    }

    // Also check for the catch-all redirect
    if (appContent.includes('<Route path="*" element={<Navigate to="/" replace />} />')) {
        finalSkippedRoutes.push({ path: '*', reason: 'Catch-all redirect' });
    }

    console.log(`Discovered ${finalRoutes.length} routes, skipped ${finalSkippedRoutes.length}.`);
    return { routes: finalRoutes, skippedRoutes: finalSkippedRoutes };
}


async function generateHtml(routes, skippedRoutes, serverBaseUrl) {
    console.log('Generating gallery.html...');
    const timestamp = new Date().toLocaleString();

    const routeCardsHtml = await Promise.all(routes.map(async (route) => {
        let status = 'N/A';
        let loadTime = 'N/A';
        let statusClass = 'text-gray-500';

        try {
            const result = await fetchUrl(`${serverBaseUrl}${route.path}`);
            status = result.statusCode;
            loadTime = result.loadTime + 'ms';
            if (status >= 200 && status < 400) {
                statusClass = 'text-green-500';
            } else {
                statusClass = 'text-red-500';
            }
        } catch (error) {
            status = 'Failed';
            loadTime = 'N/A';
            statusClass = 'text-red-500';
            console.error(`Failed to verify route ${route.path}: ${error.message}`);
            skippedRoutes.push({ path: route.path, reason: `Verification failed: ${error.message}` });
        }

        return `
            <div class="route-card">
                <div class="route-info">
                    <h3>${route.path}</h3>
                    <p><strong>Source:</strong> ${route.source}</p>
                    <p><strong>Framework:</strong> ${route.framework}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
                    <p><strong>Load Time:</strong> ${loadTime}</p>
                </div>
                <div class="preview-container">
                    <div class="preview">
                        <h4>Mobile (${MOBILE_WIDTH}x${MOBILE_HEIGHT})</h4>
                        <iframe src="${serverBaseUrl}${route.path}" style="width:${MOBILE_WIDTH}px; height:${MOBILE_HEIGHT}px;"></iframe>
                    </div>
                    <div class="preview">
                        <h4>Desktop (${DESKTOP_WIDTH}x${DESKTOP_HEIGHT})</h4>
                        <iframe src="${serverBaseUrl}${route.path}" style="width:${DESKTOP_WIDTH}px; height:${DESKTOP_HEIGHT}px;"></iframe>
                    </div>
                </div>
            </div>
        `;
    }));

    const skippedRoutesHtml = skippedRoutes.length > 0 ? `
        <div class="skipped-routes">
            <h2>Skipped or Failed Routes (${skippedRoutes.length})</h2>
            <ul>
                ${skippedRoutes.map(s => `<li><strong>${s.path}</strong>: ${s.reason}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Route Gallery</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; background-color: #f4f7f6; color: #333; }
                .header { background-color: #2c3e50; color: white; padding: 15px 20px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .header-info { font-size: 14px; text-align: right; }
                .container { padding: 20px; display: grid; grid-template-columns: 1fr; gap: 30px; }
                @media (min-width: 1200px) {
                    .container { grid-template-columns: repeat(auto-fill, minmax(600px, 1fr)); }
                }
                .route-card { background-color: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s ease-in-out; }
                .route-card:hover { transform: translateY(-5px); }
                .route-info { padding: 20px; border-bottom: 1px solid #eee; }
                .route-info h3 { margin-top: 0; color: #2c3e50; font-size: 20px; }
                .route-info p { margin: 5px 0; font-size: 14px; }
                .preview-container { display: flex; flex-direction: column; gap: 20px; padding: 20px; }
                @media (min-width: 768px) {
                    .preview-container { flex-direction: row; justify-content: space-around; }
                }
                .preview { text-align: center; background-color: #f9f9f9; border-radius: 5px; padding: 15px; box-shadow: inset 0 0 5px rgba(0,0,0,0.05); }
                .preview h4 { margin-top: 0; color: #555; font-size: 16px; }
                iframe { border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background-color: white; }
                .text-green-500 { color: #28a745; }
                .text-red-500 { color: #dc3545; }
                .text-gray-500 { color: #6c757d; }
                .skipped-routes { background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 20px; border-radius: 8px; }
                .skipped-routes h2 { color: #856404; margin-top: 0; }
                .skipped-routes ul { list-style-type: disc; margin-left: 20px; }
                .skipped-routes li { margin-bottom: 5px; color: #856404; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Route Gallery</h1>
                <div class="header-info">
                    <p>Routes: ${routes.length} | Skipped: ${skippedRoutes.length}</p>
                    <p>Server: <a href="${serverBaseUrl}" target="_blank" style="color: white;">${serverBaseUrl}</a></p>
                    <p>Generated: ${timestamp}</p>
                </div>
            </div>
            <div class="container">
                ${routeCardsHtml.join('')}
            </div>
            ${skippedRoutesHtml}
        </body>
        </html>
    `;

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, htmlContent);
    console.log(`Gallery generated at ${OUTPUT_FILE}`);
}

async function main() {
    let serverBaseUrl;
    let allRoutes = [];
    let allSkippedRoutes = [];

    try {
        serverBaseUrl = await startDevServer();
        const { routes, skippedRoutes } = await discoverRoutes();
        allRoutes = routes;
        allSkippedRoutes = skippedRoutes;
        await generateHtml(routes, skippedRoutes, serverBaseUrl);
    } catch (error) {
        console.error('Error generating route gallery:', error);
        // If an error occurs during route verification, ensure skippedRoutes are still displayed
        if (allRoutes.length === 0 && allSkippedRoutes.length === 0) {
             // If no routes were even discovered, create a minimal gallery with just the error
            await fs.mkdir(OUTPUT_DIR, { recursive: true }).catch(() => {});
            await fs.writeFile(OUTPUT_FILE, `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Route Gallery - Error</title>
                    <style>body { font-family: sans-serif; margin: 20px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; }</style>
                </head>
                <body>
                    <h1>Error Generating Route Gallery</h1>
                    <p>An error occurred: ${error.message}</p>
                    <p>Please ensure the development server can start and routes are correctly defined.</p>
                </body>
                </html>
            `);
            console.log(`Error gallery generated at ${OUTPUT_FILE}`);
        } else {
            // If some routes were discovered but verification failed, generate with what we have
            await generateHtml(allRoutes, allSkippedRoutes, serverBaseUrl || 'http://localhost:5173');
        }
    } finally {
        stopDevServer();
        console.log(`\n--- Route Gallery Summary ---`);
        console.log(`Total Routes Rendered: ${allRoutes.length}`);
        console.log(`Total Routes Skipped/Failed: ${allSkippedRoutes.length}`);
        console.log(`Gallery HTML: ${OUTPUT_FILE}`);
    }
}

main();

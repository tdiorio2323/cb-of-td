

import { Home, Compass, MessageSquare, PlusSquare, User, Heart, X, Image as ImageIcon, Send, ThumbsUp, MessageCircle, LayoutDashboard, Settings, ShieldCheck, ShieldOff, Trash2, DollarSign, LogOut, CheckCircle2, ArrowLeft, Sparkles, Mic, MicOff, Lock, Edit } from 'lucide-react';

export const HomeIcon = () => <Home className="w-6 h-6" />;
export const DiscoverIcon = () => <Compass className="w-6 h-6" />;
export const MessagesIcon = () => <MessageSquare className="w-6 h-6" />;
export const CreateIcon = () => <PlusSquare className="w-6 h-6" />;
export const ProfileIcon = () => <User className="w-6 h-6" />;
export const HeartIcon = () => <Heart className="w-5 h-5" />;
export const CloseIcon = () => <X className="w-6 h-6" />;
export const AddImageIcon = () => <ImageIcon className="w-6 h-6" />;
export const SendIcon = () => <Send className="w-5 h-5" />;
export const LikeIcon = () => <ThumbsUp className="w-5 h-5" />;
export const CommentIcon = () => <MessageCircle className="w-5 h-5" />;

// New Icons
export const DashboardIcon = () => <LayoutDashboard className="w-6 h-6" />;
export const SettingsIcon = () => <Settings className="w-6 h-6" />;
export const VerifiedIcon = () => <ShieldCheck className="w-5 h-5 text-brand-primary" />;
export const UnverifiedIcon = () => <ShieldOff className="w-5 h-5 text-light-3" />;
export const DeleteIcon = () => <Trash2 className="w-5 h-5" />;
export const TipIcon = () => <DollarSign className="w-5 h-5" />;
export const LogoutIcon = () => <LogOut className="w-6 h-6" />;
export const CheckIcon = () => <CheckCircle2 className="w-5 h-5" />;
export const ArrowLeftIcon = () => <ArrowLeft className="w-6 h-6" />;
export const SparklesIcon = () => <Sparkles className="w-5 h-5" />;
export const MicIcon = () => <Mic className="w-5 h-5" />;
export const MicOffIcon = () => <MicOff className="w-5 h-5" />;
export const LockIcon = () => <Lock className="w-4 h-4 text-light-3" />;
export const EditIcon = () => <Edit className="w-4 h-4 mr-2" />;
export const BalanceIcon = () => <DollarSign className="w-4 h-4 text-green-400" />;
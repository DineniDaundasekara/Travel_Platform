import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatPrice = (price, currency = 'USD') => {
  if (!price) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
};

export const CATEGORIES = ['All', 'Adventure', 'Culture', 'Food & Drink', 'Nature', 'Wellness', 'Water Sports', 'Other'];

export const CATEGORY_COLORS = {
  Adventure: 'bg-orange-100 text-orange-700',
  Culture: 'bg-purple-100 text-purple-700',
  'Food & Drink': 'bg-yellow-100 text-yellow-700',
  Nature: 'bg-green-100 text-green-700',
  Wellness: 'bg-pink-100 text-pink-700',
  'Water Sports': 'bg-blue-100 text-blue-700',
  Other: 'bg-gray-100 text-gray-700',
};

export const getAvatarUrl = (user) => {
  if (user?.avatar) return user.avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10b981&color=fff`;
};

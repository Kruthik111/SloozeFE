'use client';

import { useMemo } from 'react';

interface UserAvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const colors = [
    'bg-orange-600',
    'bg-red-500',
    'bg-amber-600',
    'bg-rose-500',
    'bg-orange-500',
    'bg-red-600',
];

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
    const initials = useMemo(() => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, [name]);

    const bgColor = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }, [name]);

    const sizeClasses = {
        sm: 'w-7 h-7 text-[10px]',
        md: 'w-9 h-9 text-xs',
        lg: 'w-12 h-12 text-sm',
    };

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} ${className} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white hover:ring-orange-100 transition-all cursor-default`}
            title={name}
        >
            {initials}
        </div>
    );
}


import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    variant?: 'default' | 'compact' | 'hero';
    className?: string;
    dark?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    variant = 'default',
    className = '',
    dark = false
}) => {
    const baseClass = dark ? 'glass-card-dark' : 'glass-card';
    const variantClass = `glass-card--${variant}`;

    return (
        <div className={`${baseClass} ${variantClass} ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;

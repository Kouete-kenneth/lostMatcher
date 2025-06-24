import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconSymbolProps = {
    name: React.ComponentProps<typeof Ionicons>['name'];
    size?: number;
    color?: string;
};

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color = 'black' }) => (
    <Ionicons name={name} size={size} color={color} />
);
import React from 'react';
import { Linking, TouchableOpacity, ViewProps } from 'react-native';

type ExternalLinkProps = ViewProps & {
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  const handlePress = () => {
    Linking.openURL(href);
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
}
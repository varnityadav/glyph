import React from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LogIn, LogOut, User } from 'lucide-react';

interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface GoogleSignInProps {
  isLinked: boolean;
  googleEmail?: string;
  googleName?: string;
  googlePicture?: string;
  onLink: (profile: GoogleProfile) => void;
  onUnlink: () => void;
  compact?: boolean;
}

export default function GoogleSignIn({
  isLinked,
  googleEmail,
  googleName,
  googlePicture,
  onLink,
  onUnlink,
  compact = false,
}: GoogleSignInProps) {
  if (isLinked) {
    return (
      <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
        {googlePicture ? (
          <img
            src={googlePicture}
            alt={googleName || 'Google'}
            className={`rounded-full border border-white/10 object-cover ${compact ? 'w-6 h-6' : 'w-10 h-10'}`}
          />
        ) : (
          <div className={`rounded-full bg-white/10 flex items-center justify-center ${compact ? 'w-6 h-6' : 'w-10 h-10'}`}>
            <User className={compact ? 'w-3 h-3 text-white/50' : 'w-5 h-5 text-white/50'} />
          </div>
        )}
        {!compact && (
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{googleName || 'Google User'}</p>
            <p className="text-white/40 text-xs truncate">{googleEmail}</p>
          </div>
        )}
        <button
          onClick={() => {
            googleLogout();
            onUnlink();
          }}
          className={`flex items-center gap-1.5 rounded-xl border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-all ${
            compact ? 'px-2 py-1' : 'px-3 py-2'
          }`}
        >
          <LogOut className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {!compact && 'Unlink'}
        </button>
      </div>
    );
  }

  // Not linked - show sign-in button
  if (compact) {
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            const decoded = jwtDecode<GoogleProfile>(credentialResponse.credential);
            onLink({
              email: decoded.email,
              name: decoded.name,
              picture: decoded.picture,
              sub: decoded.sub,
            });
          }
        }}
        onError={() => console.error('Google Sign-In failed')}
        size="small"
        theme="filled_black"
        shape="pill"
        text="signin_with"
      />
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Google Account</p>
            <p className="text-white/30 text-xs">Connect for a personalized experience</p>
          </div>
        </div>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded = jwtDecode<GoogleProfile>(credentialResponse.credential);
              onLink({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                sub: decoded.sub,
              });
            }
          }}
          onError={() => console.error('Google Sign-In failed')}
          size="medium"
          theme="filled_black"
          shape="rectangular"
          text="signin_with"
        />
      </div>
    </div>
  );
}

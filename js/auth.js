/**
 * The Forsyth Group LLC - Authentication & Role Governance Engine
 * https://forsythgroup.org
 *
 * Implements:
 * - Google Identity Services (GIS) Sign-In with Google (OAuth2 / OpenID Connect)
 * - Role-Based Access Control (RBAC): Admin, Developer
 * - Default Superadmin bootstrap (eric@forsythgroup.org, eric@wideareacomm.com)
 * - Roster management, session storage, and security audit telemetry
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    ROSTER: 'fg_user_roster_v1',
    SESSION: 'fg_auth_session_v1',
    AUDIT: 'fg_audit_log_v1',
    CLIENT_ID: 'fg_google_client_id_v1',
    FAVORITES: 'fg_dev_favorites_v1'
  };

  const ROLES = {
    ADMIN: 'Admin',
    DEVELOPER: 'Developer'
  };

  // Base64URL JWT Decoder helper
  function decodeJwtPayload(token) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT credential', e);
      return null;
    }
  }

  const FGAuth = {
    ROLES,

    /**
     * Get configured Google Client ID
     */
    getGoogleClientId() {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
      if (stored && stored.trim()) return stored.trim();
      return (window.FG_CONFIG && window.FG_CONFIG.defaultGoogleClientId) || '';
    },

    /**
     * Update Google Client ID
     */
    setGoogleClientId(clientId) {
      if (clientId && clientId.trim()) {
        localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.CLIENT_ID);
      }
      this.logAudit('CONFIG_CHANGE', this.getCurrentUserEmail(), 'system', 'Updated Google OAuth Client ID');
    },

    /**
     * Check if email is in the permanent superadmin whitelist
     */
    isRootSuperadminEmail(email) {
      if (!email) return false;
      const normalized = email.toLowerCase().trim();
      const superadmins = (window.FG_CONFIG && window.FG_CONFIG.superadmins) || [
        'eric@forsythgroup.org',
        'eric@wideareacomm.com'
      ];
      return superadmins.some(admin => admin.toLowerCase().trim() === normalized);
    },

    /**
     * Retrieve all users in roster, ensuring permanent superadmins are seeded
     */
    getUsers() {
      let roster = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ROSTER);
        if (stored) {
          roster = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error reading roster from storage', e);
      }

      if (!Array.isArray(roster) || roster.length === 0) {
        roster = (window.FG_CONFIG && window.FG_CONFIG.initialUsers) ? [...window.FG_CONFIG.initialUsers] : [];
      }

      // Always guarantee permanent root superadmins exist with full permissions
      const superadmins = [
        {
          email: 'eric@forsythgroup.org',
          name: 'Eric Forsyth',
          roles: ['Admin', 'Developer'],
          status: 'active',
          department: 'Architecture & Leadership',
          notes: 'Root Superadmin / Principal Enterprise Architect',
          isRootSuperadmin: true,
          addedAt: '2026-10-14T09:00:00.000Z'
        },
        {
          email: 'eric@wideareacomm.com',
          name: 'Eric Forsyth (WideAreaComm)',
          roles: ['Admin', 'Developer'],
          status: 'active',
          department: 'Executive Engineering',
          notes: 'Root Superadmin / Wide Area Communications',
          isRootSuperadmin: true,
          addedAt: '2026-10-14T09:00:00.000Z'
        }
      ];

      superadmins.forEach(sa => {
        const idx = roster.findIndex(u => u.email.toLowerCase().trim() === sa.email.toLowerCase().trim());
        if (idx === -1) {
          roster.unshift(sa);
        } else {
          // Ensure permissions are intact
          roster[idx].roles = Array.from(new Set([...(roster[idx].roles || []), 'Admin', 'Developer']));
          roster[idx].status = 'active';
          roster[idx].isRootSuperadmin = true;
        }
      });

      return roster;
    },

    /**
     * Save roster to localStorage
     */
    saveUsers(roster) {
      try {
        localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(roster));
      } catch (e) {
        console.error('Error saving roster to storage', e);
      }
    },

    /**
     * Find a user in the roster by email
     */
    getUserByEmail(email) {
      if (!email) return null;
      const normalized = email.toLowerCase().trim();
      const users = this.getUsers();
      return users.find(u => u.email.toLowerCase().trim() === normalized) || null;
    },

    /**
     * Add a new team member to the roster
     */
    addUser({ email, name, roles, status, department, notes }) {
      if (!email || !email.includes('@')) {
        throw new Error('A valid email address is required.');
      }
      const normalized = email.toLowerCase().trim();
      const users = this.getUsers();

      if (users.some(u => u.email.toLowerCase().trim() === normalized)) {
        throw new Error(`User with email "${normalized}" already exists in the roster.`);
      }

      const cleanRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['Developer'];
      const newUser = {
        email: normalized,
        name: name && name.trim() ? name.trim() : normalized.split('@')[0],
        roles: cleanRoles,
        status: status || 'active',
        department: department ? department.trim() : 'Engineering',
        notes: notes ? notes.trim() : '',
        isRootSuperadmin: this.isRootSuperadminEmail(normalized),
        addedAt: new Date().toISOString()
      };

      users.push(newUser);
      this.saveUsers(users);
      this.logAudit('USER_ADDED', this.getCurrentUserEmail(), normalized, `Assigned roles: ${cleanRoles.join(', ')}`);
      return newUser;
    },

    /**
     * Update an existing team member's roles, status, or details
     */
    updateUser(email, updates) {
      if (!email) throw new Error('Email is required.');
      const normalized = email.toLowerCase().trim();
      const users = this.getUsers();
      const idx = users.findIndex(u => u.email.toLowerCase().trim() === normalized);

      if (idx === -1) {
        throw new Error(`User "${normalized}" not found.`);
      }

      const existing = users[idx];
      const isRoot = this.isRootSuperadminEmail(normalized);

      // Protect root superadmins from being demoted or deactivated
      let updatedRoles = updates.roles !== undefined ? updates.roles : existing.roles;
      let updatedStatus = updates.status !== undefined ? updates.status : existing.status;

      if (isRoot) {
        updatedRoles = Array.from(new Set([...updatedRoles, 'Admin', 'Developer']));
        updatedStatus = 'active';
      }

      users[idx] = {
        ...existing,
        name: updates.name !== undefined ? updates.name.trim() : existing.name,
        roles: updatedRoles,
        status: updatedStatus,
        department: updates.department !== undefined ? updates.department.trim() : existing.department,
        notes: updates.notes !== undefined ? updates.notes.trim() : existing.notes,
        updatedAt: new Date().toISOString()
      };

      this.saveUsers(users);

      // If updating current user's session, update session as well
      const current = this.getCurrentUser();
      if (current && current.email.toLowerCase().trim() === normalized) {
        this.setSessionUser({
          ...current,
          name: users[idx].name,
          roles: users[idx].roles,
          status: users[idx].status
        });
      }

      this.logAudit('USER_UPDATED', this.getCurrentUserEmail(), normalized, `Updated roles: ${updatedRoles.join(', ')} (${updatedStatus})`);
      return users[idx];
    },

    /**
     * Delete / Revoke user from roster
     */
    deleteUser(email) {
      if (!email) return false;
      const normalized = email.toLowerCase().trim();

      if (this.isRootSuperadminEmail(normalized)) {
        throw new Error('Permanent root superadministrators cannot be removed.');
      }

      let users = this.getUsers();
      const initialLength = users.length;
      users = users.filter(u => u.email.toLowerCase().trim() !== normalized);

      if (users.length !== initialLength) {
        this.saveUsers(users);
        this.logAudit('USER_DELETED', this.getCurrentUserEmail(), normalized, 'Revoked user access');
        return true;
      }
      return false;
    },

    /**
     * Get current authenticated session
     */
    getCurrentUser() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!stored) return null;
        const session = JSON.parse(stored);
        if (!session || !session.email) return null;

        // Synchronize with live roster data
        const liveUser = this.getUserByEmail(session.email);
        if (liveUser) {
          return {
            ...session,
            name: liveUser.name || session.name,
            roles: liveUser.roles || [],
            status: liveUser.status,
            isRootSuperadmin: !!liveUser.isRootSuperadmin
          };
        } else if (this.isRootSuperadminEmail(session.email)) {
          return {
            ...session,
            roles: ['Admin', 'Developer'],
            status: 'active',
            isRootSuperadmin: true
          };
        }

        return session;
      } catch (e) {
        console.error('Error parsing session', e);
        return null;
      }
    },

    /**
     * Get email of current authenticated user, or 'system' / 'guest'
     */
    getCurrentUserEmail() {
      const user = this.getCurrentUser();
      return user ? user.email : 'guest';
    },

    /**
     * Set authenticated session in storage
     */
    setSessionUser(userData) {
      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(userData));
      } catch (e) {
        console.error('Error saving session', e);
      }
    },

    /**
     * Check if current session is authenticated
     */
    isAuthenticated() {
      const user = this.getCurrentUser();
      return user !== null && user.status === 'active';
    },

    /**
     * Check if current session user has Admin role
     */
    isAdmin() {
      const user = this.getCurrentUser();
      if (!user || user.status !== 'active') return false;
      if (this.isRootSuperadminEmail(user.email)) return true;
      return Array.isArray(user.roles) && user.roles.includes(ROLES.ADMIN);
    },

    /**
     * Check if current session user has Developer role (or Admin)
     */
    isDeveloper() {
      const user = this.getCurrentUser();
      if (!user || user.status !== 'active') return false;
      if (this.isRootSuperadminEmail(user.email)) return true;
      return Array.isArray(user.roles) && (user.roles.includes(ROLES.DEVELOPER) || user.roles.includes(ROLES.ADMIN));
    },

    /**
     * Authenticate via Google Identity Services (GIS) JWT Credential
     */
    loginWithGoogleCredential(credential) {
      const payload = decodeJwtPayload(credential);
      if (!payload || !payload.email) {
        return {
          success: false,
          error: 'Unable to parse valid Google identity credential.'
        };
      }

      const email = payload.email.toLowerCase().trim();
      const isSuperadmin = this.isRootSuperadminEmail(email);
      let rosterUser = this.getUserByEmail(email);

      // If root superadmin signs in for the first time
      if (!rosterUser && isSuperadmin) {
        rosterUser = {
          email,
          name: payload.name || 'Eric Forsyth',
          roles: ['Admin', 'Developer'],
          status: 'active',
          department: 'Executive Engineering',
          notes: 'Root Superadmin',
          isRootSuperadmin: true,
          addedAt: new Date().toISOString()
        };
        const users = this.getUsers();
        users.unshift(rosterUser);
        this.saveUsers(users);
      }

      const sessionUser = {
        email,
        name: (rosterUser && rosterUser.name) || payload.name || email.split('@')[0],
        picture: payload.picture || '',
        sub: payload.sub || '',
        roles: (rosterUser && rosterUser.roles) || (isSuperadmin ? ['Admin', 'Developer'] : []),
        status: (rosterUser && rosterUser.status) || (isSuperadmin ? 'active' : 'unassigned'),
        isRootSuperadmin: isSuperadmin,
        loginMethod: 'google_gis',
        loggedInAt: new Date().toISOString()
      };

      this.setSessionUser(sessionUser);
      this.logAudit('LOGIN_GOOGLE', email, email, `Google Auth success. Roles: ${sessionUser.roles.join(', ') || 'None'}`);

      return {
        success: true,
        user: sessionUser
      };
    },

    /**
     * Quick / Test Login as an email (for testing or root admin instant access)
     */
    loginAs(email, optionalName, optionalPicture) {
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Valid email required' };
      }
      const normalized = email.toLowerCase().trim();
      const isSuperadmin = this.isRootSuperadminEmail(normalized);
      let rosterUser = this.getUserByEmail(normalized);

      if (!rosterUser && isSuperadmin) {
        rosterUser = {
          email: normalized,
          name: optionalName || 'Eric Forsyth',
          roles: ['Admin', 'Developer'],
          status: 'active',
          department: 'Architecture & Leadership',
          isRootSuperadmin: true,
          addedAt: new Date().toISOString()
        };
        const users = this.getUsers();
        users.unshift(rosterUser);
        this.saveUsers(users);
      }

      const sessionUser = {
        email: normalized,
        name: (rosterUser && rosterUser.name) || optionalName || normalized.split('@')[0],
        picture: optionalPicture || '',
        roles: (rosterUser && rosterUser.roles) || (isSuperadmin ? ['Admin', 'Developer'] : []),
        status: (rosterUser && rosterUser.status) || (isSuperadmin ? 'active' : 'unassigned'),
        isRootSuperadmin: isSuperadmin,
        loginMethod: 'dev_direct',
        loggedInAt: new Date().toISOString()
      };

      this.setSessionUser(sessionUser);
      this.logAudit('LOGIN_DIRECT', normalized, normalized, `Direct session switch. Roles: ${sessionUser.roles.join(', ') || 'None'}`);

      return {
        success: true,
        user: sessionUser
      };
    },

    /**
     * Terminate current session
     */
    logout() {
      const email = this.getCurrentUserEmail();
      this.logAudit('LOGOUT', email, email, 'Session terminated');
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      } catch (e) {
        console.error('Error clearing session', e);
      }
    },

    /**
     * Initialize Google Identity Services (GIS) on a page
     */
    initGoogleAuth(options = {}) {
      const { buttonContainerId, callback, autoPrompt = false } = options;
      const clientId = this.getGoogleClientId();

      const handleCredentialResponse = (response) => {
        if (response && response.credential) {
          const authResult = this.loginWithGoogleCredential(response.credential);
          if (callback && typeof callback === 'function') {
            callback(authResult);
          } else {
            window.location.reload();
          }
        }
      };

      const renderGIS = () => {
        if (!window.google || !window.google.accounts || !window.google.accounts.id) {
          console.warn('Google Identity Services SDK not loaded yet.');
          return;
        }

        if (!clientId) {
          console.warn('No Google Client ID configured.');
          return;
        }

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (buttonContainerId) {
            const container = document.getElementById(buttonContainerId);
            if (container) {
              const isDark = document.documentElement.classList.contains('dark');
              window.google.accounts.id.renderButton(container, {
                type: 'standard',
                shape: 'pill',
                theme: isDark ? 'filled_black' : 'outline',
                text: 'signin_with',
                size: 'large',
                logo_alignment: 'left',
                width: 280
              });
            }
          }

          if (autoPrompt && !this.isAuthenticated()) {
            window.google.accounts.id.prompt();
          }
        } catch (err) {
          console.error('Error initializing Google Identity Services', err);
        }
      };

      // Load GIS script if not present
      if (!window.google || !window.google.accounts) {
        const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = renderGIS;
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener('load', renderGIS);
        }
      } else {
        renderGIS();
      }
    },

    /**
     * Audit Logging
     */
    logAudit(action, actor, target, details) {
      try {
        let logs = [];
        const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
        if (stored) {
          logs = JSON.parse(stored);
        }
        logs.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          timestamp: new Date().toISOString(),
          action,
          actor: actor || 'anonymous',
          target: target || 'system',
          details: details || ''
        });
        // Limit to 100 entries
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
      } catch (e) {
        console.error('Error logging audit event', e);
      }
    },

    getAuditLogs() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    },

    clearAuditLogs() {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUDIT);
        this.logAudit('AUDIT_CLEARED', this.getCurrentUserEmail(), 'audit_log', 'Audit log cleared');
      } catch (e) {}
    },

    /**
     * Export and Import Roster JSON
     */
    exportRosterJSON() {
      const data = {
        exportedAt: new Date().toISOString(),
        exportedBy: this.getCurrentUserEmail(),
        users: this.getUsers()
      };
      return JSON.stringify(data, null, 2);
    },

    importRosterJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        const usersToImport = Array.isArray(parsed) ? parsed : (parsed.users || []);
        if (!Array.isArray(usersToImport)) {
          throw new Error('Invalid JSON format: expected an array of users or an object with a users array.');
        }

        const existingUsers = this.getUsers();
        let addedCount = 0;
        let updatedCount = 0;

        usersToImport.forEach(incoming => {
          if (!incoming.email || !incoming.email.includes('@')) return;
          const normalized = incoming.email.toLowerCase().trim();
          const existingIdx = existingUsers.findIndex(u => u.email.toLowerCase().trim() === normalized);

          if (existingIdx !== -1) {
            existingUsers[existingIdx] = {
              ...existingUsers[existingIdx],
              ...incoming,
              email: normalized,
              updatedAt: new Date().toISOString()
            };
            updatedCount++;
          } else {
            existingUsers.push({
              email: normalized,
              name: incoming.name || normalized.split('@')[0],
              roles: Array.isArray(incoming.roles) ? incoming.roles : ['Developer'],
              status: incoming.status || 'active',
              department: incoming.department || 'Engineering',
              notes: incoming.notes || '',
              addedAt: new Date().toISOString()
            });
            addedCount++;
          }
        });

        this.saveUsers(existingUsers);
        this.logAudit('ROSTER_IMPORTED', this.getCurrentUserEmail(), 'roster', `Imported ${addedCount} new, ${updatedCount} updated`);
        return { success: true, addedCount, updatedCount };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    /**
     * Favorites / Pinned Tools Management for Developer Portal
     */
    getFavorites() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return stored ? JSON.parse(stored) : [
          'apple-app-store-connect',
          'google-play-console',
          'github-org',
          'vercel-dashboard',
          'neon-console',
          'microsoft-entra',
          'claude-ai',
          'claude-platform'
        ];
      } catch (e) {
        return [];
      }
    },

    toggleFavorite(toolId) {
      try {
        let favs = this.getFavorites();
        if (favs.includes(toolId)) {
          favs = favs.filter(id => id !== toolId);
        } else {
          favs.push(toolId);
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        return favs.includes(toolId);
      } catch (e) {
        return false;
      }
    },

    isFavorite(toolId) {
      return this.getFavorites().includes(toolId);
    }
  };

  window.FGAuth = FGAuth;
})(window);

const appRoot = require('app-root-path');

const { Manifest: ManifestShared } = require('@loftyshaky/shared/js/ext/manifest');

const app_root = appRoot.path;

const manifest_shared = new ManifestShared({ app_root });

class Manifest {
    generate = ({ test, browser }) => {
        const manifest = {
            manifest_version: 3,
            name: 'Clear New Tab',
            description: '__MSG_description__',
            background: {
                service_worker: 'background.js',
            },
            action: {
                default_icon: {
                    16: 'icon16.png',
                    32: 'icon32.png',
                    64: 'icon64.png',
                },
            },
            options_ui: {
                page: 'settings.html',
                open_in_tab: true,
            },
            chrome_url_overrides: {
                newtab: 'new_tab.html',
            },
            sandbox: {
                pages: ['sandbox.html'],
            },
            permissions: ['storage', 'alarms', 'management'],
            optional_permissions: ['clipboardRead'],
            host_permissions: [
                // '<all_urls>',
                'https://clients2.google.com/*',
                'https://clients2.googleusercontent.com/*',
                ...(browser === 'edge'
                    ? [
                          'https://edge.microsoft.com/*',
                          'http://msedgeextensions.f.tlu.dl.delivery.mp.microsoft.com/*',
                      ]
                    : []),
            ],
        };

        if (test) {
            manifest.key =
                'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuocWy+emYbMEiJlZfohSmX7hatQvNyVbOaF31z56o522a7C+ZMH3DLhQoVmbTGthGg75tSsel7DubWqPPxBqbw5TAMthUIMRNLZixPq4+xJDwgmqqTJtkkjmrE7dgTRtEM6VBA5RtlhELj1TsEEr2cMeynVjQOXP/n4t2NeEHO22ISOf0fXc8Muu63NNkQ0G/yyarMPTXDixiJlwsM5U0uYBcPWSi0HClTqkRVfHzRL5oVbSi/70p4QAwwJSZFIoxAvEHpA8dNWrCKe9LsZoWnmbKYv9VNi8ygckszOcGChWsJBgkxVAVAuBz3RpAR7kH2qEgU5Pj6+avEQVQL8vlAgMBAAECggEALc4U8xsGIIr2JaT0puT2kaUtz+0JCZM0B7PsYVtx/E+nuikVWxMTCaz+cI4pLlouPGC2BCjHMUhDYj5mFUsUx6KHU9qCT57AnpXFJUiRn7kjY1Jx8/VgFQMdyTfEs6fF7R+2ytTLi+r+0Y9o8PpdD0MJvlnzP7qyKGyKwhjjy2dlhefhmLuQ5UAMVqKYavi6btQOtXOEjS81J00psjZvuYaVl/dIp/ZOs0e+PKQl21fK5Izira3+B479JKMH3Drd4K8DZ2UDjJBPuj2J3lY5xbOiYvVGTuPV7JO4Q11/gmXzAcpVvjUkrpb2H/DQ1toZKHWqIGgXAraBcs9cQiBPyQKBgQDrb0KTOyRCl+PxNi+NmLVisK4uKRoMcyLgbPHi9WKxqZx0maQHHeKAUik5UEmm4RzS4RytwID+Mm/HDPLizqqo6IZ6JTrhTr932VI+jkzPsYxqtD3OMuEQERN8KJGkX8UU/RqWpLWbt4eMrZdgocW6yvmKFkd/4f8vu//EFAxpywKBgQC94trphP/TvWcrgQd5mOcsxim5uq1ZvZrIkdabW1SCNRcpY0ZYjnI7mNYB/dU+XEQA6JeqIGhaJt/NtjkIB1AGdhLJaXLf7PZgXD1YGiv9TExU7PU/2GeTdrW98bV75bgZjtHf+CuKQOTI0K7aiUl9xJD9c/0EB+sp1uikbQGrDwKBgQC/5Cc3KXUccgBvkeKgXl842RietxFsJEvA8AsXGTof5EaJItD2m/0I6e5/sFjXk5OSrbhaRhTdGu7QJlWxVxDyKtOwqrea/DxCyval1gX1Ipl4PwBBGGcoWUKwZ8CNYSGZQdJyBj2fda8dkj9Xm4M2BEnvqskMCn+bwHdusYiMkQKBgESO2Zcii/N5GPzeE0LV7/F8gqgqPFiAWpg7/44MBZEVdg1daJKkq53U6r/BU/K2AV+Kmuez17lk+70cI69AZKZQjyvlRLKQrcvQwd1DZcqId67Z9xpcGdlmLOwtjuby4+tmY2RICABcub2/isIge0ZLaEX6UMnZyhBLJafoK4gFAoGBAKUS4wAkZF+HYEkeWPeEEYgS0w/3MHnv413qQVuToC+DsPvsOI9+/Z7VLSiGWvzEEvyXDoIzQihxEckDz1oql4dY1RPZNcVd5ZGdTmUIcRZ7WGmgqgMDSc+kBSRHosroYEUciWML8YDRtUnT131WdqsO8NUDuiibKaIq0U5g0FgV';
        }

        manifest_shared.generate({
            manifest,
            browser,
            monochrome_new_tab_icon: browser === 'edge',
        });
    };
}

module.exports = { Manifest };

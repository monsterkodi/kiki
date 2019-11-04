// koffee 1.4.0
var MainMenu, Menu, path, pkg, win;

win = require('kxk').win;

pkg = require('../package.json');

path = require('path');

Menu = require('electron').Menu;

MainMenu = (function() {
    function MainMenu() {}

    MainMenu.init = function(main) {
        return Menu.setApplicationMenu(Menu.buildFromTemplate([
            {
                label: pkg.name,
                submenu: [
                    {
                        label: "About " + pkg.productName,
                        click: main.showAbout
                    }, {
                        type: 'separator'
                    }, {
                        label: "Hide " + pkg.productName,
                        accelerator: 'Command+H',
                        click: main.hideWindows
                    }, {
                        label: 'Hide Others',
                        accelerator: 'Command+Alt+H',
                        role: 'hideothers'
                    }, {
                        type: 'separator'
                    }, {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: main.quit
                    }
                ]
            }, {
                label: 'Window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'Alt+Cmd+M',
                        click: function(i, win) {
                            return win != null ? win.minimize() : void 0;
                        }
                    }, {
                        label: 'Maximize',
                        accelerator: 'Cmd+Shift+m',
                        click: function(i, win) {
                            return main.toggleMaximize(win);
                        }
                    }, {
                        type: 'separator'
                    }, {
                        label: 'Reload Window',
                        accelerator: 'Ctrl+Alt+Cmd+L',
                        click: function(i, win) {
                            return main.reloadWin(win);
                        }
                    }, {
                        label: 'Toggle FullScreen',
                        accelerator: 'Ctrl+Command+Alt+F',
                        click: function(i, win) {
                            return win != null ? win.setFullScreen(!win.isFullScreen()) : void 0;
                        }
                    }
                ]
            }, {
                label: 'Help',
                role: 'help',
                submenu: []
            }
        ]));
    };

    return MainMenu;

})();

module.exports = MainMenu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbm1lbnUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFFLE1BQVEsT0FBQSxDQUFRLEtBQVI7O0FBQ1YsR0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUjs7QUFDUixJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUM7O0FBRXRCOzs7SUFFRixRQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsSUFBRDtlQUVILElBQUksQ0FBQyxrQkFBTCxDQUF3QixJQUFJLENBQUMsaUJBQUwsQ0FBdUI7WUFFM0M7Z0JBQUEsS0FBQSxFQUFPLEdBQUcsQ0FBQyxJQUFYO2dCQUNBLE9BQUEsRUFBUztvQkFDTDt3QkFBQSxLQUFBLEVBQWEsUUFBQSxHQUFTLEdBQUcsQ0FBQyxXQUExQjt3QkFDQSxLQUFBLEVBQWMsSUFBSSxDQUFDLFNBRG5CO3FCQURLLEVBSUw7d0JBQUEsSUFBQSxFQUFNLFdBQU47cUJBSkssRUFNTDt3QkFBQSxLQUFBLEVBQWEsT0FBQSxHQUFRLEdBQUcsQ0FBQyxXQUF6Qjt3QkFDQSxXQUFBLEVBQWEsV0FEYjt3QkFFQSxLQUFBLEVBQWEsSUFBSSxDQUFDLFdBRmxCO3FCQU5LLEVBVUw7d0JBQUEsS0FBQSxFQUFhLGFBQWI7d0JBQ0EsV0FBQSxFQUFhLGVBRGI7d0JBRUEsSUFBQSxFQUFhLFlBRmI7cUJBVkssRUFjTDt3QkFBQSxJQUFBLEVBQU0sV0FBTjtxQkFkSyxFQWdCTDt3QkFBQSxLQUFBLEVBQWEsTUFBYjt3QkFDQSxXQUFBLEVBQWEsV0FEYjt3QkFFQSxLQUFBLEVBQWEsSUFBSSxDQUFDLElBRmxCO3FCQWhCSztpQkFEVDthQUYyQyxFQThCM0M7Z0JBQUEsS0FBQSxFQUFPLFFBQVA7Z0JBQ0EsT0FBQSxFQUFTO29CQUNMO3dCQUFBLEtBQUEsRUFBYSxVQUFiO3dCQUNBLFdBQUEsRUFBYSxXQURiO3dCQUVBLEtBQUEsRUFBYSxTQUFDLENBQUQsRUFBRyxHQUFIO2lEQUFXLEdBQUcsQ0FBRSxRQUFMLENBQUE7d0JBQVgsQ0FGYjtxQkFESyxFQUtMO3dCQUFBLEtBQUEsRUFBYSxVQUFiO3dCQUNBLFdBQUEsRUFBYSxhQURiO3dCQUVBLEtBQUEsRUFBYSxTQUFDLENBQUQsRUFBRyxHQUFIO21DQUFXLElBQUksQ0FBQyxjQUFMLENBQW9CLEdBQXBCO3dCQUFYLENBRmI7cUJBTEssRUFTTDt3QkFBQSxJQUFBLEVBQU0sV0FBTjtxQkFUSyxFQVdMO3dCQUFBLEtBQUEsRUFBYSxlQUFiO3dCQUNBLFdBQUEsRUFBYSxnQkFEYjt3QkFFQSxLQUFBLEVBQWEsU0FBQyxDQUFELEVBQUcsR0FBSDttQ0FBVyxJQUFJLENBQUMsU0FBTCxDQUFlLEdBQWY7d0JBQVgsQ0FGYjtxQkFYSyxFQWVMO3dCQUFBLEtBQUEsRUFBYSxtQkFBYjt3QkFDQSxXQUFBLEVBQWEsb0JBRGI7d0JBRUEsS0FBQSxFQUFhLFNBQUMsQ0FBRCxFQUFHLEdBQUg7aURBQVcsR0FBRyxDQUFFLGFBQUwsQ0FBbUIsQ0FBQyxHQUFHLENBQUMsWUFBSixDQUFBLENBQXBCO3dCQUFYLENBRmI7cUJBZks7aUJBRFQ7YUE5QjJDLEVBeUQzQztnQkFBQSxLQUFBLEVBQU8sTUFBUDtnQkFDQSxJQUFBLEVBQU0sTUFETjtnQkFFQSxPQUFBLEVBQVMsRUFGVDthQXpEMkM7U0FBdkIsQ0FBeEI7SUFGRzs7Ozs7O0FBZ0VYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAwMDAgICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcblxueyB3aW4gfSA9IHJlcXVpcmUgJ2t4aydcbnBrZyAgID0gcmVxdWlyZSAnLi4vcGFja2FnZS5qc29uJ1xucGF0aCAgPSByZXF1aXJlICdwYXRoJ1xuTWVudSAgPSByZXF1aXJlKCdlbGVjdHJvbicpLk1lbnVcblxuY2xhc3MgTWFpbk1lbnVcbiAgICBcbiAgICBAaW5pdDogKG1haW4pIC0+IFxuICAgICAgICBcbiAgICAgICAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUgTWVudS5idWlsZEZyb21UZW1wbGF0ZSBbXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxhYmVsOiBwa2cubmFtZSAgIFxuICAgICAgICAgICAgc3VibWVudTogWyAgICAgXG4gICAgICAgICAgICAgICAgbGFiZWw6ICAgICAgIFwiQWJvdXQgI3twa2cucHJvZHVjdE5hbWV9XCJcbiAgICAgICAgICAgICAgICBjbGljazogICAgICAgIG1haW4uc2hvd0Fib3V0XG4gICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICBsYWJlbDogICAgICAgXCJIaWRlICN7cGtnLnByb2R1Y3ROYW1lfVwiXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kK0gnXG4gICAgICAgICAgICAgICAgY2xpY2s6ICAgICAgIG1haW4uaGlkZVdpbmRvd3NcbiAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICBsYWJlbDogICAgICAgJ0hpZGUgT3RoZXJzJ1xuICAgICAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtBbHQrSCdcbiAgICAgICAgICAgICAgICByb2xlOiAgICAgICAgJ2hpZGVvdGhlcnMnXG4gICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICBsYWJlbDogICAgICAgJ1F1aXQnXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kK1EnXG4gICAgICAgICAgICAgICAgY2xpY2s6ICAgICAgIG1haW4ucXVpdFxuICAgICAgICAgICAgXVxuICAgICAgICAsICAgICAgICBcbiAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICAgICAgICAgIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgICAgICAgICAjIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICAgICAgICAgIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxhYmVsOiAnV2luZG93J1xuICAgICAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgICAgICAgIGxhYmVsOiAgICAgICAnTWluaW1pemUnXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdBbHQrQ21kK00nXG4gICAgICAgICAgICAgICAgY2xpY2s6ICAgICAgIChpLHdpbikgLT4gd2luPy5taW5pbWl6ZSgpXG4gICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICAgICAgICdNYXhpbWl6ZSdcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZCtTaGlmdCttJ1xuICAgICAgICAgICAgICAgIGNsaWNrOiAgICAgICAoaSx3aW4pIC0+IG1haW4udG9nZ2xlTWF4aW1pemUgd2luXG4gICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICAgICAgICAgICwgICBcbiAgICAgICAgICAgICAgICBsYWJlbDogICAgICAgJ1JlbG9hZCBXaW5kb3cnXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDdHJsK0FsdCtDbWQrTCdcbiAgICAgICAgICAgICAgICBjbGljazogICAgICAgKGksd2luKSAtPiBtYWluLnJlbG9hZFdpbiB3aW5cbiAgICAgICAgICAgICwgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGFiZWw6ICAgICAgICdUb2dnbGUgRnVsbFNjcmVlbidcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0N0cmwrQ29tbWFuZCtBbHQrRidcbiAgICAgICAgICAgICAgICBjbGljazogICAgICAgKGksd2luKSAtPiB3aW4/LnNldEZ1bGxTY3JlZW4gIXdpbi5pc0Z1bGxTY3JlZW4oKVxuICAgICAgICAgICAgXVxuICAgICAgICAsICAgICAgICBcbiAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgICAgICAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuICAgICAgICAgICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAgICAgICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgICAgICAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsYWJlbDogJ0hlbHAnXG4gICAgICAgICAgICByb2xlOiAnaGVscCdcbiAgICAgICAgICAgIHN1Ym1lbnU6IFtdICAgICAgICAgICAgXG4gICAgICAgIF1cblxubW9kdWxlLmV4cG9ydHMgPSBNYWluTWVudVxuIl19
//# sourceURL=../coffee/mainmenu.coffee
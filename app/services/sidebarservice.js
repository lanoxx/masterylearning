angular.module ('myApp.services.sidebar', [])

    /**
     * Enum Implementation based on:
     * https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
     **/

.factory ('SidebarService', [
    function Sidebar() {

        return {
            collapsed: false
        }
    }
]);

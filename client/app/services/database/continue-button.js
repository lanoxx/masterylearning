angular.module ('myapp.factories.continue-button', ['myapp.factories.entrydata'])

.factory ('ContinueButton', ['EntryData', '$log', function (EntryData, $log)
{

    function ContinueButton ()
    {
        EntryData.call (this, null, 'continue-button');
    }

    ContinueButton.prototype = Object.create (EntryData.prototype);
    ContinueButton.prototype.constructor = ContinueButton;

    return ContinueButton;
}]);

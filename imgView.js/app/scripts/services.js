'use strict';

console.log("Bootstraping config..." + JSON.stringify(CONFIG));

APP.constant("imagePath", CONFIG.imagePath)

.constant("lookAt", CONFIG.lookAt)

.constant("category", CONFIG.category)

.factory('homeFactory', ['$resource', 'lookAt', function($resource, lookAt) {
    return $resource("./data/" + lookAt, null, null);
}])

;

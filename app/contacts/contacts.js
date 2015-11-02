'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

// Contacts controller
.controller('ContactsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    // Init Firebase
    var ref = new Firebase('https://awesome-contacts-app.firebaseio.com/contacts');
    
    // get Contacts
	$scope.contacts = $firebaseArray(ref);
	//console.log($scope.contacts);

	// Show Add Form
	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	}
    
    // Show Edit Form
	$scope.showEditForm = function(contact){
		$scope.editFormShow = true;
        
        $scope.id               = contact.$id;
        $scope.name             = contact.name;
        $scope.email            = contact.email;
        $scope.company          = contact.company;
        $scope.mobile_phone     = contact.phones[0].mobile;
        $scope.home_phone       = contact.phones[0].home;
        $scope.work_phone       = contact.phones[0].work;
        $scope.street_address   = contact.address[0].street_address;
        $scope.city             = contact.address[0].city;
        $scope.state            = contact.address[0].state;
        $scope.zipcode          = contact.address[0].zipcode;
	}

	// Hide Forms
	$scope.hide = function(){
		$scope.addFormShow = false;
        $scope.contactShow = false;
	}
    
    // submit contact
    $scope.addFormSubmit = function() {
        console.log('Adding contact...');
        
        // Assign values
        var name = $scope.name || null;
        var email = $scope.email || null;
        var company = $scope.company || null;
        var mobile_phone = $scope.mobile_phone || '';
        var home_phone = $scope.home_phone || '';
        var work_phone = $scope.work_phone || '';
        var street_address = $scope.street_address || '';
        var city = $scope.city || '';
        var state = $scope.state || '';
        var zipcode = $scope.zipcode || '';
        
        // Build Object
        $scope.contacts.$add({
            name: name,
            email: email,
            company: company,
            phones: [
                {
                    mobile: mobile_phone,
                    home: home_phone,
                    work: work_phone
                }
                
            ],
            address: [
                {
                    street_address: street_address,
                    city: city,
                    state: state,
                    zipcode: zipcode
                }
            ]
        }).then(function(ref){
            var id = ref.key();
            console.log('Adding contact with ID: ' + id);
            
            // Clear form
            clearFields();
            
            // Hide Form
            $scope.addFormShow = false;
            
            // Send Message
            $scope.msg = "Contact Added";
        });
    }
    
    $scope.editFormSubmit = function(){
		console.log('Updating Contact...');

		// Get ID
		var id = $scope.id;

		// Get Record
		var record = $scope.contacts.$getRecord(id);

		// Assign Values
		record.name 						= $scope.name;
		record.email 						= $scope.email;
		record.company 						= $scope.company;
		record.phones[0].work 				= $scope.work_phone;
		record.phones[0].home 				= $scope.home_phone;
		record.phones[0].mobile 			= $scope.mobile_phone;
		record.address[0].street_address 	= $scope.street_address;
		record.address[0].city 				= $scope.city;
		record.address[0].state 			= $scope.state;
		record.address[0].zipcode 			= $scope.zipcode;

		// Save Conrtact
		$scope.contacts.$save(record).then(function(ref){
			console.log(ref.key);
		});

		clearFields();

		// Hide Form
		$scope.editFormShow = false;

		$scope.msg = "Contact Updated";
	}
    
    $scope.showContact = function(contact){
        console.log('Getting contact...');
        
        $scope.name             = contact.name;
        $scope.email            = contact.email;
        $scope.company          = contact.company;
        $scope.mobile_phone     = contact.phones[0].mobile;
        $scope.home_phone       = contact.phones[0].home;
        $scope.work_phone       = contact.phones[0].work;
        $scope.street_address   = contact.address[0].street_address;
        $scope.city             = contact.address[0].city;
        $scope.state            = contact.address[0].state;
        $scope.zipcode          = contact.address[0].zipcode;
        
        $scope.contactShow = true;
    }
    
    $scope.removeContact = function(contact) {
        console.log('Removing contact...');
        
        $scope.contacts.$remove(contact);
        
        $scope.msg = "Contact Removed";
        
        clearFields();
        
        $scope.editFormShow = false;
        $scope.addFormShow = false;
    }
    
    // Clear $scope fields
    function clearFields() {
        console.log("Clearing all form fields");

        $scope.name = '';
        $scope.email = '';
        $scope.company = '';
        $scope.mobile_phone = '';
        $scope.home_phone = '';
        $scope.work_phone = '';
        $scope.street_address = '';
        $scope.city = '';
        $scope.state = '';
        $scope.zipcode = '';
    }
    
}]);
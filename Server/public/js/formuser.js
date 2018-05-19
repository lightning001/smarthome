$("#formRegister").validate({
	rules : {
		email :{
			require : true,
			email : true
		},
		name : {
			require : true,
			minlength : 5
		},
		password: {
            required: true,
            minlength: 6
        },
        confirmPassword: {
            required: true,
            minlength: 6,
            equalTo: "#password"
        },
        postcode : {
        	require : true,
        	digits : true
        },
        dob : {
        	require : false,
        	date : true
        },
        phonenumber : {
        	require : true,
        	number : true,
        	minlength : 3
        },
        homephonenumber : {
        	number : true,
        	minlegth : 3
        },
        img : {
        	accept : 'image/*'
        }
	},
	messages : {
		email :{
			require : 'Please enter your email',
			email : 'Please enter your email'
		},
		name : {
			require : 'Please enter your name',
			minlength : 'Please enter valid name'
		},
		password: {
            required: 'Please enter your password',
            minlength: 'Password must be 6 - 28 chars and not contains special characters'
        },
        confirmPassword: {
            required: 'Please confirm your password',
            minlength: 'Password must be 6 - 28 chars and not contains special characters',
            equalTo: 'Confirm password is wrong'
        },
        postcode : {
        	require : 'Please enter postcode',
        	digits : 'Postcode must be a number'
        },
        dob : {
        	date : 'Please enter a date'
        },
        phonenumber : {
        	require : 'Please enter your phone number',
        	number : 'Phone number must be a number',
        	minlegth : 'Phone number you entered is too short'
        },
        homephonenumber : {
        	number : 'Home phone number you entered is too short'
        },
        img : {
        	accept : 'Please choose an image file'
        }
		
	}
});
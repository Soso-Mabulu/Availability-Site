$(document).ready(function(){
	$('#action_menu_btn').click(function(){
		$('.action_menu').toggle();
	});
});

$(document).ready(function () {
    // Initialize Firebase
    var firebaseConfig = {
		apiKey: "AIzaSyC7tFwWk1NZ5BKr7-JiOpul8f0lbhI2tZE",
		authDomain: "tutoring-app-40e02.firebaseapp.com",
		projectId: "tutoring-app-40e02",
		storageBucket: "tutoring-app-40e02.appspot.com",
		messagingSenderId: "848147097720",
		appId: "1:848147097720:web:f9e6f2dd98240412d6658d",
		measurementId: "G-M6Y7CR7FYJ"
    };
    
    firebase.initializeApp(firebaseConfig);

    // Get elements
    var txtMessage = $('#type_msg');
    var btnSend = $('#send_btn');
    var chatWindow = $('#chat-window');

    // Set up Firebase references
    var auth = firebase.auth();
    var database = firebase.database();
    var chatsRef = database.ref('chats');

    // Check if user is logged in
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            var currentUser = user.uid;

            // Send a message
            btnSend.click(function () {
                var message = txtMessage.val();

                if (message.trim() !== "") {
                    chatsRef.push({
                        sender: currentUser,
                        message: message,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });

                    txtMessage.val('');
                }
            });

            // Retrieve messages
            chatsRef.on('child_added', function (snapshot) {
                var message = snapshot.val();
                var messageHTML = '<div class="d-flex justify-content-start mb-4">' +
                                  '<div class="img_cont_msg">' +
                                  '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">' +
                                  '</div>' +
                                  '<div class="msg_cotainer">' +
                                  message.message +
                                  '<span class="msg_time">' + formatTimestamp(message.timestamp) + '</span>' +
                                  '</div>' +
                                  '</div>';

                chatWindow.append(messageHTML);
            });

            // Handle ellipsis menu actions
            $('#action_menu_btn').click(function () {
                $('.action_menu').toggle();
            });

            $('.action_menu ul li').click(function () {
                // Implement actions for ellipsis menu items
                var action = $(this).text().trim();

                switch (action) {
                    case 'View profile':
                        alert('View profile clicked');
                        break;
                    case 'Add to close friends':
                        alert('Add to close friends clicked');
                        break;
                    case 'Add to group':
                        alert('Add to group clicked');
                        break;
                    case 'Block':
                        alert('Block clicked');
                        break;
                    default:
                        break;
                }

                // Hide the menu after clicking an item
                $('.action_menu').hide();
            });
        } else {
            // User is not signed in, implement authentication logic here
            alert('User not authenticated');
        }
    });

	    // Fetch and display the list of users
		var userList = $('#user-list');

		firebase.database().ref('users').once('value').then(function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				var user = childSnapshot.val();
				var userHTML = '<li>' +
							   '<div class="d-flex bd-highlight">' +
							   '<div class="img_cont">' +
							   '<img src="' + user.profileImage + '" class="rounded-circle user_img">' +
							   '<span class="online_icon"></span>' +
							   '</div>' +
							   '<div class="user_info">' +
							   '<span>' + user.displayName + '</span>' +
							   '<p>' + user.status + '</p>' +
							   '</div>' +
							   '</div>' +
							   '</li>';
				userList.append(userHTML);
			});
		});
	

    // Function to format timestamp
    function formatTimestamp(timestamp) {
        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

	    // Function to load chat messages for a specific user
		function loadChatForUser(userId) {
			// Assuming you have a 'messages' node in your database
			var messagesRef = firebase.database().ref('messages').child(userId);
	
			// Clear existing messages
			$('#chat-window').empty();
	
			// Retrieve and display messages
			messagesRef.on('child_added', function (snapshot) {
				var message = snapshot.val();
				var messageHTML = '<div class="d-flex justify-content-start mb-4">' +
								  '<div class="img_cont_msg">' +
								  '<img src="' + message.senderImage + '" class="rounded-circle user_img_msg">' +
								  '</div>' +
								  '<div class="msg_cotainer">' +
								  message.text +
								  '<span class="msg_time">' + formatTimestamp(message.timestamp) + '</span>' +
								  '</div>' +
								  '</div>';
				$('#chat-window').append(messageHTML);
			});
		}
	
		// Event listener for contact list items
		$('#user-list').on('click', 'li', function () {
			// Extract the userId from the clicked list item (you might store userId as a data attribute)
			var userId = $(this).data('user-id');
	
			// Load chat for the selected user
			loadChatForUser(userId);
		});
});
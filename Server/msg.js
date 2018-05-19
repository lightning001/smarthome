var en = {
   error: {
     occur: 'Error! An error occurred. Please try again later',
     login_incorrect: 'Email or password is incorrected',
     exist_email: 'This email is already exists',
     confirm_register : 'An error occurred while requesting email confirmation. Please try again',
     confirm_register_response : 'Oh no. We can not do your request now. Please try again later',
     verify_token : 'Oh no.  We can not do your request now. Please try later',
     field : {
    	 email : 'Must be an email',
    	 name : 'Name must be at least 5 chars long',
    	 password : 'Passwords are at least 6 characters long and do not contain special characters'
     },
     not_rule : 'You can\'t have rule request another user info',
     verify : 'We can not verify. Please try again',
	 incorrect_password : 'Your current password enter is incorrected'
   },
   success: {
     confirm_register : 'You have sent email requesting confirmation of success. Please check your email to activate your account'
   },
   empty: {
     cant_find: 'Can\'t find'

   },
   not_exist: {
     account: 'The account does not exists'
   }
 }
var vi = {
   error: {
     occur: 'Đã xảy ra lỗi. Vui lòng thực hiện lại sau ít phút',
     login_incorrect: 'Email hoặc mật khẩu không chính xác',
     exist_email : 'Email này đã tồn tại',
     confirm_register : 'Đã xảy ra lỗi khi yêu cầu xác nhận email. Vui lòng thực hiện lại',
     confirm_register_response : 'Ôi không. Hiện chúng tôi chưa thể thực hiện được yêu cầu này bây giờ. Vui lòng thực hiện lại sau ít phút',
     verify_token : 'Ôi không. Chúng tôi không thể thực hiện yêu cầu này',
     field : {
    	 email : 'Phải là email',
    	 name : 'Tên phải dài tối thiểu 5 ký tự',
    	 password : 'Mật khẩu dài ít nhất 6 ký tự và không chứa ký tự đặc biệt'
    	 
     },
     not_rule : 'Bạn chỉ có thể yêu cầu thông tin của bạn',
     verify : 'Xác thực không thành công, vui lòng thực hiện lại',
	 incorrect_password : 'Mật khẩu hiện tại không đúng'
   },
   success: {
     confirm_register : 'Quý khách đã gửi yêu cầu xác nhận email thành công. Vui lòng kiểm tra email để kích hoạt tài khoản'
   },
   empty: {
     cant_find: 'Không tìm thấy kết quả'
   },
   not_exist: {
     account: 'Tài khoản không tồn tại'
   }
 }

 module.exports = exports = {
   en : en,
   vi : vi
 };

package com.example.josephpham.app.activity

import android.app.Activity
import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.Intent
import android.graphics.Bitmap
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import com.example.josephpham.app.R
import com.example.josephpham.app.interfaces.UploadIMG
import com.example.josephpham.app.model.User
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_register_user.*
import kotlinx.android.synthetic.main.activity_user.*
import kotlinx.android.synthetic.main.dialog_active_mail.view.*
import kotlinx.android.synthetic.main.dialog_change_address.view.*
import kotlinx.android.synthetic.main.dialog_change_email.view.*
import kotlinx.android.synthetic.main.dialog_change_homephone.view.*
import kotlinx.android.synthetic.main.dialog_change_name.view.*
import kotlinx.android.synthetic.main.dialog_change_phonenumber.view.*
import kotlinx.android.synthetic.main.dialog_password.view.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

class UserActivity : AppCompatActivity(), UploadIMG {

    var dob: Date? = null
//    val user = LoginActivity.user
    var mSocket = LoginActivity.msocket
    val REQUEST_TAKE_PICTURE = 123
    var bitmap: Bitmap? = null
    var user: User = User("ádad","josephpham1996","1234", "trần văn ơn", "dĩ an", "Bình DƯơng", 123,"0972992607","753327",
            Date(1996,4,13),"normal",false, Date(8/5/2018),"phạm văn phát","https://www.facebook.com/photo.php?fbid=623771871120998&set=a.105654686266055.14204.100004645720534&type=3&theater", ArrayList(),ArrayList())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        setSupportActionBar(toolbaruser)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        control()
        addEvent()

    }
    fun control(){
        if(user.img == ""){
            civimguser.setImageResource(R.drawable.profile)
        }else{
            Picasso.get().load(user.img)
        }
        var sp = SimpleDateFormat("dd/mm/yyyy")
        tvnameuser.setText(user.name)
        tvemailuser.setText(user.email)
        tvdiachi.setText(user.street+" / "+user.district+" / " + user.city)
        tvdob.setText(sp.format(user.dob))
        tvphonehome.setText(user.homephone)
        tvphonenumber.setText(user.phonenumber)
    }
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        if (user.status == false) {
            menuInflater.inflate(R.menu.menu_user, menu)
        }else {
            menuInflater.inflate(R.menu.menu_user_active, menu)
        }
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
            when (item.itemId) {
                R.id.action_update_name -> {
                    openDialogUpdateName()

                }
                R.id.action_update_mail -> {
                    openDialogUpdatEmail()

                }
                R.id.action_active_mail -> {
                    openDialogActiveEmail()

                }
            }
        return true
    }

    fun addEvent(){
        fabuploadimg.setOnClickListener {
            takePicture()

        }
        tvdiachi.setOnLongClickListener {
            openDialogChangeAddress()
        }
        tvphonenumber.setOnLongClickListener {
            openDialogChangePhoneNumber()
        }
        tvphonehome.setOnLongClickListener {
            openDialogChangeHomePhoneNumber()
        }
        tvdob.setOnLongClickListener {
            dataPickerDialog()
        }
    }
    fun takePicture(){
        val intent: Intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivityForResult(intent, REQUEST_TAKE_PICTURE)
    }
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_TAKE_PICTURE && resultCode == Activity.RESULT_OK){
            bitmap = data!!.extras.get("data") as Bitmap
            bitmap = resize(bitmap!!, 200,200)
            civimguser.setImageBitmap(bitmap)
            val bytes = getByteArrayToByBitmap(bitmap!!)
            mSocket.emit("uploadIMG", bytes)
        }
    }
    private fun openDialogUpdateName() {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_name, null)
        mView.updatename.setText(user.name)
        mView.submitname.setOnClickListener {
            updateName(mView.updatename.text.toString())
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
    }

    private fun openDialogUpdatEmail() {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_password, null)
        mView.submitpassword.setOnClickListener {
            mView.password_dialog.text
            openDialogUpdatEmail2()
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
    }


    private fun  openDialogUpdatEmail2() {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_email, null)
        mView.email_dialog.setText(user.email)
        mView.submitemail.setOnClickListener {
            updatemail(mView.email_dialog.text.toString())
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
    }
    private fun openDialogActiveEmail() {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_active_mail, null)
        mBundle.setView(mView)
        val dialog = mBundle.create()
        mView.submitActiveUser.setOnClickListener {
            dialog.dismiss()
        }
        mView.cancelActive.setOnClickListener {
            dialog.dismiss()
        }
        dialog.show()
    }


    fun openDialogChangeAddress(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_address, null)
        mView.streetupdate.setText(user.street)
        mView.districtupdate.setText(user.district)
        mView.cityupdate.setText(user.city)
        mView.postcode.setText(user.postcode.toString())
        mView.submitAddress.setOnClickListener {
            updateAddress(mView.streetupdate.text.toString(), mView.districtupdate.toString(),
                    mView.cityupdate.text.toString(), mView.postcode.text.toString())
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
        return true
    }
    fun openDialogChangePhoneNumber(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_phonenumber, null)
        mView.updatephonenumber.setText(user.phonenumber)
        mView.submitphonenumber.setOnClickListener {
            updatePhoneNumber( mView.updatephonenumber.text.toString())
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
        return true

    }
    private fun openDialogChangeHomePhoneNumber(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_homephone, null)
        mView.updatehomephone.setText(user.homephone)
        mView.submithomephone.setOnClickListener {
            updateHomePhone( mView.updatehomephone.text.toString())
        }
        mBundle.setView(mView)
        val dialog = mBundle.create()
        dialog.show()
        return true
    }

    fun dataPickerDialog(): Boolean {
        val calendar: Calendar = Calendar.getInstance()
        val ngay = calendar.get(Calendar.DATE)
        val thang = calendar.get(Calendar.MONTH)
        val nam = calendar.get(Calendar.YEAR)
        var simpleDateFormat: SimpleDateFormat = SimpleDateFormat("dd/MM/yyyy")
        val dialog = DatePickerDialog(this@UserActivity, DatePickerDialog.OnDateSetListener { view, year, month, dayOfMonth ->
            calendar.set(year, month, dayOfMonth)
            val date = calendar.time
            Log.d("calendar", simpleDateFormat.format(date))
        }, nam, thang, ngay)
        dialog.show()
        dob = calendar.time
        tvdob.setText(simpleDateFormat.format(dob).toString())
        return true
    }
    private fun updatemail(email: String) {

    }

    private fun updateName(name: String) {

    }

    private fun updateHomePhone(homephone: String) {

    }

    private fun updateAddress(street: String, district: String, city: String,  postcode: String) {

    }

    private fun updatePhoneNumber(phonenumber: String) {

    }
}

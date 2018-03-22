package com.example.josephpham.smarthome.sqlite

import android.content.Context
import android.database.Cursor
import android.util.Log
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.id_user
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.image_Room
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.room
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.table_Room
import org.jetbrains.anko.db.insert


/**
 * Created by Joseph Pham on 12/18/2017.
 */
class CreateDepartmentManipulation(context: Context) {
    var context: Context = context

    var dbHelper: DatabaseHandler

    init {
        dbHelper = DatabaseHandler.getInstance(context)
    }
    fun insertRoom(name: String, image: Int, idAcc: Int): Boolean {
        val db = dbHelper.writableDatabase
        db?.insert(table_Room,
                id_user to idAcc,
                room to name,
                image_Room to image
        )
        return true
        Log.d("DATA", "" + db.toString())
    }

    fun showData(): Cursor? {
        val db = dbHelper.getReadableDatabase()
        val res = db?.rawQuery("SELECT * FROM " + table_Room, null)
        return res
    }

}
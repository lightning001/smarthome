package com.example.josephpham.smarthome.sqlite

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.DATABASE_NAME
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.id_Room
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.id_user
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.image_Room
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.room
import com.example.josephpham.smarthome.sqlite.ConstantTableFieldsName.table_Room
import org.jetbrains.anko.db.*

class DatabaseHandler(context: Context) : ManagedSQLiteOpenHelper(context, DATABASE_NAME) {

    companion object {
        private var instance: DatabaseHandler? = null

        @Synchronized
        fun getInstance(ctx: Context): DatabaseHandler {
            if (instance == null) {
                instance = DatabaseHandler(ctx.applicationContext)
            }
            return instance!!
        }
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        db?.execSQL("DROP TABLE IF EXISTS " + table_Room)
    }

    override fun onCreate(db: SQLiteDatabase) {
        createStudentTable(db)
    }

    private fun createStudentTable(db: SQLiteDatabase) {
        db.createTable(table_Room, true, id_Room to INTEGER + PRIMARY_KEY + AUTOINCREMENT,
                id_user to INTEGER,
                room to TEXT,
                image_Room to INTEGER)

    }
}
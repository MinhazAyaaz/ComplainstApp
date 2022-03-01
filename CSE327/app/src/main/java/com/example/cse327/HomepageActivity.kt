package com.example.cse327

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

    class HomepageActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_homepage)

            val createButton = findViewById<Button>(R.id.createButton5);

            createButton.setOnClickListener{
                val intent = Intent(this, CreateComplaint::class.java)
                startActivity(intent)
            }

        }
    }
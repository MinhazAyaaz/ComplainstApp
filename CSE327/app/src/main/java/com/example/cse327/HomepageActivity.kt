package com.example.cse327

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.CheckBox
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

        fun onCheckboxClicked(view: View) {
            if (view is CheckBox) {
                val checked: Boolean = view.isChecked

                when (view.id) {
                    R.id.checkBox -> {
                        if (checked) {
                            // Put some meat on the sandwich
                        } else {
                            // Remove the meat
                        }
                    }
                    R.id.checkBox2 -> {
                        if (checked) {
                            // Cheese me
                        } else {
                            // I'm lactose intolerant
                        }
                    }
                    R.id.checkBox3 -> {
                        if (checked) {
                            // Cheese me
                        } else {
                            // I'm lactose intolerant
                        }
                    }
                    // TODO: Veggie sandwich
                }
            }
        }
    }
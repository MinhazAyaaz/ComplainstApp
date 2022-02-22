package com.example.cse327

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Toast
import com.example.cse327.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity(), AdapterView.OnItemClickListener {

    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val roles = resources.getStringArray(R.array.roles)
        val adapter = ArrayAdapter(
            this,
            R.layout.list_item,
            roles
        )

        with(binding.autoCompleteTextView){
            setAdapter(adapter)
            onItemClickListener = this@MainActivity
        }

        val confirmButton = findViewById(R.id.button2) as Button
        // set on-click listener
        confirmButton.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        val item = parent?.getItemAtPosition(position).toString()
        Toast.makeText(this@MainActivity,item,Toast.LENGTH_SHORT).show()
    }
}

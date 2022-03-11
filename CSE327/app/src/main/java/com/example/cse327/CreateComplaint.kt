package com.example.cse327
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.os.Bundle
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.text.Editable
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_complaint.*
import java.util.*
import kotlin.collections.ArrayList



class CreateComplaint : AppCompatActivity() {

    private val RQ_SPEECH_REC = 102
    lateinit var activityResultLauncher: ActivityResultLauncher<Intent>
    var checkButton = ""


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_complaint)

        imageButton4.setOnClickListener {
            checkButton = "imageButton4"
            speechToText()
        }

        imageButton5.setOnClickListener {
            checkButton = "imageButton5"
            speechToText()
        }
        imageButton6.setOnClickListener {
            checkButton = "imageButton6"
            speechToText()
        }
        imageButton7.setOnClickListener {
            checkButton = "imageButton7"
            speechToText()
        }

        button4.setOnClickListener{
            openFileExplorer()
        }

        activityResultLauncher=registerForActivityResult(ActivityResultContracts.StartActivityForResult()){ result: ActivityResult? ->
            if(result!!.resultCode == RESULT_OK && result!!.data!=null && checkButton=="imageButton4"){
                val speechtext = result!!.data!!.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) as ArrayList<Editable>
                autoCompleteTextView2.text = speechtext[0]
                checkButton=""
            }
            else if(result!!.resultCode == RESULT_OK && result!!.data!=null && checkButton=="imageButton5"){
                val speechtext = result!!.data!!.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) as ArrayList<Editable>
                text3.text = speechtext[0]
                checkButton=""
            }
            else if(result!!.resultCode == RESULT_OK && result!!.data!=null && checkButton=="imageButton6"){
                val speechtext = result!!.data!!.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) as ArrayList<Editable>
                editTextTextMultiLine.text = speechtext[0]
                checkButton=""
            }
            else if(result!!.resultCode == RESULT_OK && result!!.data!=null && checkButton=="imageButton7"){
                val speechtext = result!!.data!!.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) as ArrayList<Editable>
                autoCompleteTextView3.text = speechtext[0]
                checkButton=""
            }
        }

    }

    private fun openFileExplorer(){
        val j = Intent(Intent.ACTION_GET_CONTENT)
        j.setType("*/*")
        activityResultLauncher.launch(j)
    }

    private fun speechToText() {
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
        i.putExtra(RecognizerIntent.EXTRA_PROMPT, "Say Something!")
        try {
            activityResultLauncher.launch(i)
        } catch (exp: ActivityNotFoundException) {
            Toast.makeText(this, "Speech is not available!", Toast.LENGTH_SHORT).show()
        }
    }


}
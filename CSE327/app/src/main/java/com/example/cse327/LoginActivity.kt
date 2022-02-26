package com.example.cse327

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task


const val RC_SIGN_IN = 123

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        var checkError = false;

        val signUpButton = findViewById<TextView>(R.id.textView4);
        val imageButton2 = findViewById<ImageButton>(R.id.imageButton2);
        val emailField = findViewById<EditText>(R.id.emailField)
        val passField = findViewById<EditText>(R.id.passField)
        val errorUser = findViewById<TextView>(R.id.errorEmail)
        val errorPass = findViewById<TextView>(R.id.errorPass)
        val backButton = findViewById<ImageButton>(R.id.imageButton)
        val loginButton = findViewById<Button>(R.id.button)


        // set on-click listener
        signUpButton.setOnClickListener{
            val url = "http://www.facebook.com"
            val i = Intent(Intent.ACTION_VIEW)
            i.data = Uri.parse(url)
            startActivity(i)
        }

        // set on-click listener
        backButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        // set on-click listener
        loginButton.setOnClickListener {
            val url : String = emailField.text.toString();
            val check : Boolean = "@northsouth.edu" in url
            if(check==false){
                errorUser.setText("Please use an NSU email.")
                checkError = true;
            }
            if(url.trim().isEmpty()){
                errorUser.setText("Please enter an email.")
                checkError = true;
            }
            if(passField.text.toString().length < 6) {
                errorPass.setText("Password is too small.")
                checkError = true;
            }
            if(passField.text.toString().trim().isEmpty()) {
                errorPass.setText("Please enter a password.")
                checkError = true;
            }
            if(checkError==false) {
                val intent = Intent(this, HomepageActivity::class.java)
                startActivity(intent)
            }
        }

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()
        val mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        imageButton2.visibility = View.VISIBLE;
        imageButton2.setOnClickListener{
            val signInIntent = mGoogleSignInClient.signInIntent
            startActivityForResult(signInIntent, RC_SIGN_IN)
        }

        val acct = GoogleSignIn.getLastSignedInAccount(this)
        if (acct != null) {
            val personName = acct.displayName
            val personGivenName = acct.givenName
            val personFamilyName = acct.familyName
            val personEmail = acct.email
            val personId = acct.id
            val personPhoto = acct.photoUrl
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val account = completedTask.getResult(ApiException::class.java)
            // Signed in successfully, show authenticated UI.
            val intent = Intent(this, HomepageActivity::class.java)
            startActivity(intent)
        } catch (e: ApiException) {
            Toast.makeText(getApplicationContext(),"Google Sign-In unsuccessful!", Toast.LENGTH_SHORT).show();
        }
    }

}
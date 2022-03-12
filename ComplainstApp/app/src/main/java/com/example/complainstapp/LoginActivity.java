package com.example.complainstapp;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.complainstapp.databinding.ActivityMainBinding;
import com.google.android.material.textfield.TextInputLayout;

import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

public class LoginActivity extends AppCompatActivity {

    private TextInputLayout usernameLayout;
    private TextInputLayout passwordLayout;
    private Button loginButton;
    private TextView signUpButton;
    private ImageButton backButton;
    GoogleSignInClient mGoogleSignInClient;
    ImageButton signInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        usernameLayout = findViewById(R.id.outlinedTextField);
        passwordLayout = findViewById(R.id.outlinedPassField);
        loginButton = findViewById(R.id.button);
        signUpButton = findViewById(R.id.textView4);
        backButton = findViewById(R.id.imageButton);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        signInButton = findViewById(R.id.signInButton);

        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent signInIntent = mGoogleSignInClient.getSignInIntent();
                startActivityForResult.launch(signInIntent);
            }
        });



        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!validateEmail() | !validatePassword()){
                    return;
                }

                Intent intent = new Intent(LoginActivity.this, HomepageActivity.class);
                startActivity(intent);

            }
        });

        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Uri uri = Uri.parse("http://www.google.com"); // missing 'http://' will cause crash
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

    }

    ActivityResultLauncher<Intent> startActivityForResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if(result.getResultCode() == Activity.RESULT_OK){
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
                        handleSignInResult(task);
                    }
                }
            }
    );

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {

            GoogleSignInAccount acct = completedTask.getResult(ApiException.class);
            if (acct != null) {
                String personName = acct.getDisplayName();
                String personGivenName = acct.getGivenName();
                String personFamilyName = acct.getFamilyName();
                String personEmail = acct.getEmail();
                String personId = acct.getId();
                Uri personPhoto = acct.getPhotoUrl();
            }

        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.d("GOOGLE ERROR", e.getMessage());
        }
    }

    private boolean validateEmail(){
        String emailInput = usernameLayout.getEditText().getText().toString().trim();

        if(emailInput.isEmpty()){
            usernameLayout.setError("Field can't be empty!");
            return false;
        }
        else if(!emailInput.contains("@northsouth.edu")){
            usernameLayout.setError("Please use a valid NSU email!");
            return false;
        }
        else{
            usernameLayout.setError(null);
            return true;
        }
    }

    private boolean validatePassword(){
        String passInput = passwordLayout.getEditText().getText().toString().trim();

        if(passInput.isEmpty()){
            passwordLayout.setError("Field can't be empty!");
            return false;
        }
        else{
            passwordLayout.setError(null);
            return true;
        }
    }

}
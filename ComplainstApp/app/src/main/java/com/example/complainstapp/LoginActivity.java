package com.example.complainstapp;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import com.google.android.material.textfield.TextInputLayout;

import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private String accessToken;
    private TextInputLayout idLayout;
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

        AndroidNetworking.initialize(getApplicationContext());

        idLayout = findViewById(R.id.outlinedIdField);
        passwordLayout = findViewById(R.id.outlinedPassField);
        loginButton = findViewById(R.id.button);
        signUpButton = findViewById(R.id.textView4);
        backButton = findViewById(R.id.imageButton);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com")
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

                AndroidNetworking.post("http://192.168.0.109:5000/login")
                        .addBodyParameter("nsuid", idLayout.getEditText().getText().toString())
                        .addBodyParameter("password", passwordLayout.getEditText().getText().toString())
                        .setTag("test")
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener() {
                            @Override
                            public void onResponse(JSONObject response) {
                                try {
                                    accessToken = response.getString("accessToken");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                Intent intent = new Intent(LoginActivity.this, HomepageActivity.class);
                                intent.putExtra("token",accessToken);
                                startActivity(intent);
                            }
                            @Override
                            public void onError(ANError error) {
                                if(error.getErrorCode()==401) {
                                    Toast.makeText(LoginActivity.this, "Password is incorrect!", Toast.LENGTH_SHORT).show();
                                }
                                else if(error.getErrorCode()==512){
                                    Toast.makeText(LoginActivity.this, "User is not verified!", Toast.LENGTH_SHORT).show();
                                }
                                else{
                                    Log.e("Error", String.valueOf(error.getErrorCode()));
                                    Toast.makeText(LoginActivity.this, "An error occurred.Try again!", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });

            }
        });

        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Uri uri = Uri.parse("http://192.168.0.109:3000/signup");
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

                Log.e("Token Id",acct.getIdToken());
                Log.e("Acct Id",acct.getDisplayName().substring((acct.getDisplayName().lastIndexOf(" ") + 1)));

                AndroidNetworking.post("http://192.168.0.109:5000/Gsignup")
                        .addBodyParameter("token",acct.getIdToken())
                        .addBodyParameter("nsuid",acct.getDisplayName().substring((acct.getDisplayName().lastIndexOf(" ") + 1)))
                        .setTag("test1")
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener(){
                            @Override
                            public void onResponse(JSONObject response) {
                                try {
                                    accessToken = response.getString("accessToken");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                Intent myIntent = new Intent(LoginActivity.this, HomepageActivity.class);
                                myIntent.putExtra("token",accessToken);
                                startActivity(myIntent);
                                finish();
                            }
                            @Override
                            public void onError(ANError error) {
                                Log.e("google error",error.toString());
                            }
                        });

            }else {
                // Signed out, show unauthenticated UI.
                Toast.makeText(this,"Account does not exist. Please sign up!",Toast.LENGTH_LONG).show();
            }

        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.d("GOOGLE ERROR", e.getMessage());
        }
    }

    private boolean validateEmail(){
        String emailInput = idLayout.getEditText().getText().toString().trim();

        if(emailInput.isEmpty()){
            idLayout.setError("Field can't be empty!");
            return false;
        }
        else if(!(emailInput.length()==10)){
            idLayout.setError("NSU id must be 10 characters long!");
            return false;
        }
        else{
            idLayout.setError(null);
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
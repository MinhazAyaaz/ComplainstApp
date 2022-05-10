package com.example.complainstapp;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.os.Environment;
import android.os.Handler;
import android.provider.MediaStore;
import android.speech.RecognizerIntent;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.ANRequest;
import com.androidnetworking.common.ANResponse;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import org.apache.commons.text.similarity.LevenshteinDistance;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class CreateComplaint extends AppCompatActivity {

    //Declaring permission codes for the audio,camera and file requests
    private static final int REQUEST_AUDIO_PERMISSION_CODE = 1;
    private static final int CAMERA_REQUEST_CODE = 2;
    private static final int FILE_REQUEST_CODE = 3;

    //Declaring strings,booleans and other variables which are used to keep track
    //Of several instances
    private String accessToken;
    private String nsuid;
    private ArrayList<String> againstArrayNames;
    private ArrayList<String> againstArrayId;
    private ArrayList<String> reviewerArrayNames;
    private ArrayList<String> userNameArray;
    private ArrayList<String> userIDArray;
    private String checkButton;
    private Context context;
    private MediaRecorder mediaRecorder;
    private String audioSavePath = null;
    private String imageSavePath = null;
    private String evidenceUrl = null;
    private boolean isRecording = false;
    private boolean fileExists;
    private StorageReference mStorage;
    private ProgressDialog mProgress;
    private OutputStream outputStream;

    //Declaring Activity Results which performs a result intent
    //These launches starts a different/dialog activity to show result of an activity
    private ActivityResultLauncher<Intent> TTSlauncher;
    private ActivityResultLauncher<Intent> cameralauncher;
    private ActivityResultLauncher<Intent> filelauncher;

    //Declaring variables for the fields and buttons in the create complaint page
    private AutoCompleteTextView category;
    private TextView title;
    private TextView details;
    private AutoCompleteTextView against;
    private AutoCompleteTextView reviewer;
    private ImageButton CategorySTT;
    private ImageButton AgainstSTT;
    private ImageButton TitleSTT;
    private ImageButton DetailsSTT;
    private ImageButton ReviewerSTT;
    private ImageButton uploadDocument;
    private ImageButton uploadAudio;
    private ImageButton uploadImage;
    private ImageButton backButton;
    private Button submitButton;

    //The onCreate function is called when the activity is started
    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaint);

        //Initializing the context as it cannot be accessed inside inner function calls
        context = this;

        //Initializing all the array and string variables
        againstArrayNames = new ArrayList<String>();
        againstArrayId = new ArrayList<String>();
        reviewerArrayNames = new ArrayList<String>();
        userNameArray = new ArrayList<String>();
        userIDArray = new ArrayList<String>();
        fileExists = false;
        accessToken = getIntent().getExtras().getString("token");
        nsuid = getIntent().getExtras().getString("nsuid");
        mStorage = FirebaseStorage.getInstance().getReference();
        mProgress = new ProgressDialog(this);

        //Initializing all the text fields
        backButton = findViewById(R.id.backButton);
        category = findViewById(R.id.categoryField);
        title = findViewById(R.id.titleField);
        details = findViewById(R.id.detailsField);
        against = findViewById(R.id.againstField);
        reviewer = findViewById(R.id.reviewerField);

        //Initializing all the speech to text,and upload buttons
        submitButton = findViewById(R.id.saveButton);
        CategorySTT = findViewById(R.id.categorySpeech);
        AgainstSTT = findViewById(R.id.againstSpeech);
        TitleSTT = findViewById(R.id.titleSpeech);
        DetailsSTT = findViewById(R.id.detailsSpeech);
        ReviewerSTT = findViewById(R.id.reviewSpeech);
        uploadDocument = findViewById(R.id.uploadFileButton);
        uploadAudio = findViewById(R.id.uploadAudioButton);
        uploadImage = findViewById(R.id.uploadImageButton);

        //Initializing the AndroidNetworking library by getting the app context
        AndroidNetworking.initialize(getApplicationContext());

        //Using Android Networking library to do a get request
        //which retrieves the users against which the current user will lodge a complaint
        AndroidNetworking.get("http://192.168.43.187:5000/againstusers")
                .setTag("test1")
                .addHeaders("x-access-token",accessToken)
                .setPriority(Priority.HIGH)
                .build()
                .getAsJSONArray(new JSONArrayRequestListener(){
                    @Override
                    public void onResponse(JSONArray response) {
                        for(int i=0;i<response.length();i++) {
                            try {
                                //We are storing both names and ids as we will need the id to send it
                                //to the reviewertoreview endpoint
                                againstArrayNames.add(response.getJSONObject(i).getString("name"));
                                againstArrayId.add(response.getJSONObject(i).getString("nsuid"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    @Override
                    public void onError(ANError error) {
                        Log.e("error",error.toString());
                    }
                });

        //Here we are creating an adapter to set the items in the dropdown suggestions list for against field
        ArrayAdapter<String> againstAdapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,againstArrayNames);
        against.setAdapter(againstAdapter);

        //The setOnTouchListener is used to show the suggestions list
        //On click of the reviewer field
        reviewer.setOnTouchListener(new View.OnTouchListener(){
            @Override
            public boolean onTouch(View v, MotionEvent event){
                reviewer.showDropDown();
                return false;
            }
        });

        //The setOnTouchListener is used to show the suggestions list
        //On click of the against field
        against.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                against.showDropDown();
                return false;
            }
        });

        //This listener is called when we write anything in the against field
        against.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                //This function is not used as we do not need to perform any tasks before text changed.
                Log.e("beforeTextChanged",charSequence.toString());
            }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                //This function is not used as we do not need to perform any tasks during text changed.
                Log.e("OnTextChanged",charSequence.toString());
            }
            @Override
            public void afterTextChanged(Editable editable) {
                //Here we send the against id and do a get request from the reviewerToReview endpoint
                //We then keep the names of the reviewers in the reviewerArrayNames arrayList
                //The if statement checks if the id is a valid one otherwise it doesn't send the get request
                reviewerArrayNames.clear();
                if(againstArrayNames.indexOf(editable.toString())!=-1){
                    AndroidNetworking.get("http://192.168.43.187:5000/reviewertoreview")
                            .setTag("test1")
                            .addHeaders("x-access-token",accessToken)
                            .addQueryParameter("id", againstArrayId.get(againstArrayNames.indexOf(editable.toString())))
                            .setPriority(Priority.HIGH)
                            .build()
                            .getAsJSONArray(new JSONArrayRequestListener(){
                                @Override
                                public void onResponse(JSONArray response) {
                                    for(int i=0;i<response.length();i++) {
                                        try {
                                            reviewerArrayNames.add(response.getJSONObject(i).getString("name"));
                                        } catch (JSONException e) {
                                            e.printStackTrace();
                                        }
                                    }
                                }
                                @Override
                                public void onError(ANError error) {
                                    Log.e("error",error.toString());
                                }
                            });
                }

                //Here we are creating an adapter to set the items in the dropdown suggestions list for reviewer field
                reviewerArrayNames.remove(nsuid);
                ArrayAdapter<String> reviewerAdapter = new ArrayAdapter<String>(context,android.R.layout.simple_list_item_1,reviewerArrayNames);
                reviewer.setAdapter(reviewerAdapter);
            }
        });

        //The submit button click listener
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //This conditional statement checks if any of the fields are empty
                if(category.getText().toString().isEmpty() || title.getText().toString().isEmpty() ||
                        against.getText().toString().isEmpty() || details.getText().toString().isEmpty()
                        || reviewer.getText().toString().isEmpty() || evidenceUrl == null){
                    Toast.makeText(context, "Please complete all fields and upload evidence!", Toast.LENGTH_LONG).show();
                }
                else {
                    //If all fields are filled we do a post request to create complaint.
                    //We send all the fields as body parameters
                    AndroidNetworking.post("http://192.168.43.187:5000/createcomplaint")
                            .addHeaders("x-access-token", accessToken)
                            .addBodyParameter("category", category.getText().toString())
                            .addBodyParameter("title", title.getText().toString())
                            .addBodyParameter("against", againstArrayId.get(againstArrayNames.indexOf(against.getText().toString())))
                            .addBodyParameter("body", details.getText().toString())
                            .addBodyParameter("evidence", evidenceUrl)
                            .addBodyParameter("reviewer", againstArrayId.get(againstArrayNames.indexOf(reviewer.getText().toString())))
                            .setTag("test")
                            .setPriority(Priority.HIGH)
                            .build()
                            .getAsJSONObject(new JSONObjectRequestListener() {
                                @Override
                                public void onResponse(JSONObject response) {
                                    //Upon success we send a toast for confirmation and take the user back to the homepage
                                    Toast.makeText(context, "Complaint has been created!", Toast.LENGTH_LONG).show();
                                    Log.e("Response", response.toString());

                                    //This Handler causes a delay before directing the user to the homepage
                                    new Handler().postDelayed(new Runnable() {
                                        @Override
                                        public void run() {
                                            Intent myIntent = new Intent(CreateComplaint.this, HomepageActivity.class);
                                            myIntent.putExtra("token",accessToken);
                                            startActivity(myIntent);
                                            finish();
                                        }
                                    }, 3000);
                                }
                                @Override
                                public void onError(ANError error) {
                                    //A toast is shown depending on the error code sent by the api
                                    if(error.getErrorCode()==400){
                                        Toast.makeText(context, "Content can not be empty!", Toast.LENGTH_SHORT).show();
                                    }
                                    else if(error.getErrorCode()==456){
                                        Toast.makeText(context, "Body can not be empty!", Toast.LENGTH_SHORT).show();
                                    }
                                    else if(error.getErrorCode()==405){
                                        Toast.makeText(context, "Reviewer can not be empty!", Toast.LENGTH_SHORT).show();
                                    }
                                    else if(error.getErrorCode()==406){
                                        Toast.makeText(context, "Against can not be empty!", Toast.LENGTH_SHORT).show();
                                    }
                                    else if(error.getErrorCode()==407){
                                        Toast.makeText(context, "Category can not be empty!", Toast.LENGTH_SHORT).show();
                                    }
                                    else if(error.getErrorCode()==513){
                                        Toast.makeText(context, "Some error occurred while creating a complaint!", Toast.LENGTH_SHORT).show();
                                    }
                                    else{
                                        Toast.makeText(context, "Could not create complaint!", Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                }
            }
        });

        //Listener for the back button which sends the user back to the previous activity
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
            }
        });

        //Listener for when the Speech to text button for category is clicked
        CategorySTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "category";
                speechToText();
            }
        });

        //Listener for when the Speech to text button for title is clicked
        TitleSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "title";
                speechToText();
            }
        });

        //Listener for when the Speech to text button for details is clicked
        DetailsSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "details";
                speechToText();
            }
        });

        //Listener for when the Speech to text button for against is clicked
        AgainstSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "against";
                speechToText();
            }
        });

        //Listener for when the Speech to text button for reviewer is clicked
        ReviewerSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "reviewer";
                speechToText();
            }
        });

        //Initializing the external storage path where the image or audio will get saved
        audioSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"recordingAudio.3gp";
        imageSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"capturingImage.jpg";

        //Listener to upload audio to evidence
        uploadAudio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //If a file is already uploaded we ask for confirmation from the user to overwrite current evidence file
                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }
                //isRecording variable checks if the recording is in effect
                //if the user is not currently recording anything it asks the user for recording permission.
                if(isRecording==false){

                    if(checkAudioPermissions()==true){

                        //We then initialize the mediaRecorder which is used to record audio
                        //and then start recording inside a try catch block
                        mediaRecorder = new MediaRecorder();
                        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
                        mediaRecorder.setOutputFile(audioSavePath);

                        try {
                            mediaRecorder.prepare();
                            mediaRecorder.start();
                            //we set the variable isRecording to true to track that the recording is currently in effect
                            isRecording=true;
                            Toast.makeText(CreateComplaint.this,"Recording started!",Toast.LENGTH_SHORT).show();
                        } catch (IOException e) {
                            Log.e("Media error",e.toString());
                        }

                    }else{
                        //If permission was not granted before
                        //The app requests audio and storage permissions
                        ActivityCompat.requestPermissions(CreateComplaint.this, new String[]{RECORD_AUDIO, WRITE_EXTERNAL_STORAGE}, REQUEST_AUDIO_PERMISSION_CODE);
                    }

                }
                else{
                    //if recording is currently in effect, we stop the recorder and call the upload audio method
                    mediaRecorder.stop();
                    mediaRecorder.release();
                    Toast.makeText(CreateComplaint.this,"Recording stopped!",Toast.LENGTH_SHORT).show();
                    isRecording=false;
                    uploadAudio();

                }
            }
        });

        //Listener to upload image to evidence
        uploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //If a file is already uploaded we ask for confirmation from the user to overwrite current evidence file
                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }
                //We call a function to check if camera permissions have been granted.
                askCameraPermission();
            }
        });

        //Listener to upload document to evidence
        uploadDocument.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //If a file is already uploaded we ask for confirmation from the user to overwrite current evidence file
                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }
                //We call a function to check if camera permissions have been granted.
                askFilePermission();
            }
        });


        //this activity result launcher is used to launch the camera and handle the image upload
        cameralauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {

                //Checking if the result is correct
                if(result.getResultCode() == RESULT_OK){

                    //Converting the camera data into a bitmap and then creating a new file
                    //in which the bitmap is saved
                    Bitmap bitmap = (Bitmap) result.getData().getExtras().get("data");
                    File file = new File(imageSavePath);
                    try {
                        outputStream = new FileOutputStream(file);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                    //The bitmap is compressed so as to not get a very large file
                    bitmap.compress(Bitmap.CompressFormat.JPEG,100,outputStream);
                    try {
                        outputStream.flush();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    try {
                        outputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    //Progress bar is used to show uploading feedback to the user
                    mProgress.setMessage("Uploading Image....");
                    mProgress.show();

                    //We create a path in the firebase storage and name the file using the current time.
                    StorageReference filepath = mStorage.child("Photos").child("image"+System.currentTimeMillis()+".jpg");
                    Uri uri = Uri.fromFile(new File(imageSavePath));
                    filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            //On success we show a message to the user and hide the progress bar
                            fileExists = true;
                            mProgress.dismiss();
                            Toast.makeText(CreateComplaint.this,"Image has been uploaded!",Toast.LENGTH_SHORT).show();
                            //The evidence link is then stored in a variable
                            filepath.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                                @Override
                                public void onSuccess(Uri uri) {
                                    evidenceUrl = uri.toString();
                                }
                            });
                        }
                    });
                }

            }
        });

        //this activity result launcher is used to launch the file manager and handle the file upload
        filelauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {

                //Checking if the result is correct and the data is not null
                if(result.getResultCode() == RESULT_OK && result.getData()!=null){

                    //Progress bar is used to show uploading feedback to the user
                    mProgress.setMessage("Uploading File....");
                    mProgress.show();

                    //We create a path in the firebase storage and name the file using the current time.
                    Uri data = result.getData().getData();
                    StorageReference filepath = mStorage.child("Files").child("file-"+System.currentTimeMillis()+".pdf");
                    filepath.putFile(data).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            //On success we show a message to the user and hide the progress bar
                            fileExists = true;
                            mProgress.dismiss();
                            Toast.makeText(CreateComplaint.this,"File has been uploaded!",Toast.LENGTH_SHORT).show();
                            //The evidence link is then stored in a variable
                            filepath.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                                @Override
                                public void onSuccess(Uri uri) {
                                    evidenceUrl = uri.toString();
                                }
                            });
                        }
                    });
                }
            }
        });

        //this activity result launcher is used to launch the speech to text dialog and set text accordingly
        TTSlauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {
                //Check if button clicked is category
                if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="category"){
                    Intent data = result.getData();
                    category.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                //Check if button clicked is title
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="title"){
                    Intent data = result.getData();
                    title.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                //Check if button clicked is details
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="details"){
                    Intent data = result.getData();
                    details.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                //Check if button clicked is against
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="against"){
                    Intent data = result.getData();
                    against.setText(returnSimilarAgainst(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0)));
                }
                //Check if button clicked is reviewer
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="reviewer"){
                    Intent data = result.getData();
                    reviewer.setText(returnSimilarReviewer(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0)));
                }
            }
        });
    }

    //This function create a new camera intent and launches the camera launcher activity
    private void openCamera() {
        Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cameralauncher.launch(camera);
    }

    //This function creates a new file manager intent and launches the file manager launcher activity
    private void uploadFile() {
        Intent intent = new Intent();
        intent.setType("application/pdf");
        intent.setAction(intent.ACTION_GET_CONTENT);
        filelauncher.launch(intent);
    }


    //This function is used to initialize the firebase storage path and upload audio file
    private void uploadAudio() {

        //Progress bar is used to show uploading feedback to the user
        mProgress.setMessage("Uploading Audio....");
        mProgress.show();

        //We create a path in the firebase storage and name the file using the current time.
        StorageReference filepath = mStorage.child("Audio").child("recording"+System.currentTimeMillis()+".mp3");
        Uri uri = Uri.fromFile(new File(audioSavePath));
        filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                //On success we show a message to the user and hide the progress bar
                fileExists = true;
                mProgress.dismiss();
                Toast.makeText(CreateComplaint.this,"Recording Stopped!\nAudio has been uploaded!",Toast.LENGTH_SHORT).show();
                //The evidence link is then stored in a variable
                filepath.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                    @Override
                    public void onSuccess(Uri uri) {
                        evidenceUrl = uri.toString();
                    }
                });
            }
        });
    }

    //Function which creates an intent for the speech to text
    //Depending on the button clicked the app will launch the Speech to Text dialog required for it.
    private void speechToText() {

        //For the against Speech to Text we only create the intent with english language only.
        if(checkButton.equals("against")){

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
            TTSlauncher.launch(intent);

        }
        //For the reviewer Speech to Text we only create the intent with english language only.
        else if(checkButton.equals("reviewer")){

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
            TTSlauncher.launch(intent);

        }
        //For every other Speech to Text button we show a dialog box for the user to select between bengali and english
        //According to the selected option we create the intent
        else {

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            AlertDialog.Builder builder = new AlertDialog.Builder(this);

            builder.setTitle("Choose language");
            builder.setMessage("Select your preferred language for text to speech");

            //Here we create the intent with the english language if English is selected
            builder.setPositiveButton("ENGLISH", new DialogInterface.OnClickListener() {

                public void onClick(DialogInterface dialog, int which) {

                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
                    //Upon click we launch the result launcher and close the dialog
                    TTSlauncher.launch(intent);
                    dialog.dismiss();

                }
            });

            //Here we create the intent with the bengali language if Bengali is selected
            builder.setNegativeButton("BENGALI", new DialogInterface.OnClickListener() {

                @Override
                public void onClick(DialogInterface dialog, int which) {

                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
                    //Upon click we launch the result launcher and close the dialog
                    TTSlauncher.launch(intent);
                    dialog.dismiss();
                }
            });

            AlertDialog alert = builder.create();
            alert.show();

        }

    }

    //This method decides what should be done as permissions are granted.
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            //Case for the audio permissions.
            //On granted a toast will be shown for feedback to the user
            case REQUEST_AUDIO_PERMISSION_CODE:
                if (grantResults.length > 0) {
                    boolean permissionToRecord = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                    boolean permissionToStore = grantResults[1] == PackageManager.PERMISSION_GRANTED;
                    if (permissionToRecord && permissionToStore) {
                        Toast.makeText(getApplicationContext(), "Permission Granted", Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(getApplicationContext(), "Permission Denied", Toast.LENGTH_LONG).show();
                    }
                }
                break;
            //Case for the camera permissions.
            //On granted it opens the camera
            case CAMERA_REQUEST_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    openCamera();
                }
                break;
            //Case for the file permissions.
            //On granted it opens the file manager
            case FILE_REQUEST_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    uploadFile();
                }
        }
    }

    //checks for both audio recording and write permissions and returns true if granted
    private boolean checkAudioPermissions(){

        int first = ActivityCompat.checkSelfPermission(getApplicationContext(), RECORD_AUDIO);
        int second = ActivityCompat.checkSelfPermission(getApplicationContext(), WRITE_EXTERNAL_STORAGE);

        return first == PackageManager.PERMISSION_GRANTED && second == PackageManager.PERMISSION_GRANTED;

    }

    //checks for both read and write storage permissions.
    private void askFilePermission(){
        boolean first = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED;
        boolean second = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED;

        if(!(first && second)){
            ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.READ_EXTERNAL_STORAGE},FILE_REQUEST_CODE);
        }
        //On granted it opens the file manager
        else{
            uploadFile();
        }

    }

    //checks for camera permissions
    private void askCameraPermission() {

        if(ContextCompat.checkSelfPermission(this,Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.CAMERA},CAMERA_REQUEST_CODE);
        }
        else{
            //On granted it opens the camera
            openCamera();
        }

    }

    //This function is called when a file has already been uploaded
    //It asks the user if they want to upload a different file
    private void overwriteConfirm(){

        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Confirm");
        builder.setMessage("Do you want to overwrite previous file?");

        //On YES click we let the user overwrite the file
        builder.setPositiveButton("YES", new DialogInterface.OnClickListener() {

            public void onClick(DialogInterface dialog, int which) {

                //variable to check if file exists is made false and dialog dismissed
                fileExists = false;
                dialog.dismiss();

            }
        });

        //on NO click we keep the previously uploaded file
        builder.setNegativeButton("NO", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {

                //variable to check if file exists is kept true and dialog dismissed
                fileExists = true;
                dialog.dismiss();
            }
        });

        AlertDialog alert = builder.create();
        alert.show();
    }

    //This function is used to compare similarity between two strings
    //We are mainly using this to convert Speech to text names to names which exist in the database
    private String returnSimilarAgainst(String user){

        int index = 1;
        int distance = 100;

        //The Levenshetein Distance method returns an integer based on how many operations are needed to
        //make the two strings equal
        for(int i=0;i<againstArrayNames.size();i++){
            int calculatedDistance = new LevenshteinDistance().apply(user,againstArrayNames.get(i));
            if(distance > calculatedDistance){
                distance = new LevenshteinDistance().apply(user,againstArrayNames.get(i));
                index = i;
            }
        }
        return againstArrayNames.get(index);
    }

    private String returnSimilarReviewer(String user){

        int index = 1;
        int distance = 100;

        //The Levenshetein Distance method returns an integer based on how many operations are needed to
        //make the two strings equal
        for(int i=0;i<reviewerArrayNames.size();i++){
            int calculatedDistance = new LevenshteinDistance().apply(user,reviewerArrayNames.get(i));
            if(distance > calculatedDistance){
                distance = new LevenshteinDistance().apply(user,reviewerArrayNames.get(i));
                index = i;
            }
        }
        return reviewerArrayNames.get(index);
    }

}
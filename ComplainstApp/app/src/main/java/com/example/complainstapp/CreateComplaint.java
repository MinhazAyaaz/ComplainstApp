package com.example.complainstapp;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.os.Environment;
import android.speech.RecognizerIntent;
import android.util.Log;
import android.view.View;

import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

public class CreateComplaint extends AppCompatActivity {



    private ImageButton backButton;
    private Button submitButton;

    private String accessToken;
    private ArrayList<String> userArray;
    private static final int REQUEST_CODE_SPEECH_INPUT = 1;
    private ActivityResultLauncher<Intent> launcher;
    private String checkButton;
    private Context context;
    private MediaRecorder mediaRecorder;
    private MediaPlayer mediaPlayer;
    private String audioSavePath = null;
    private boolean isRecording = false;
    private StorageReference mStorage;
    private ProgressDialog mProgress;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaint);
        context = this;

        userArray = new ArrayList<String>();

        accessToken = getIntent().getExtras().getString("token");
        mStorage = FirebaseStorage.getInstance().getReference();
        mProgress = new ProgressDialog(this);

        backButton = findViewById(R.id.backButton);
        category = findViewById(R.id.categoryField);
        title = findViewById(R.id.titleField);
        details = findViewById(R.id.detailsField);
        against = findViewById(R.id.againstField);
        reviewer = findViewById(R.id.reviewerField);

        submitButton = findViewById(R.id.saveButton);
        CategorySTT = findViewById(R.id.categorySpeech);
        AgainstSTT = findViewById(R.id.againstSpeech);
        TitleSTT = findViewById(R.id.titleSpeech);
        DetailsSTT = findViewById(R.id.detailsSpeech);
        ReviewerSTT = findViewById(R.id.reviewSpeech);
        uploadDocument = findViewById(R.id.uploadFileButton);
        uploadAudio = findViewById(R.id.uploadAudioButton);
        uploadImage = findViewById(R.id.uploadImageButton);

        AndroidNetworking.get("http://192.168.43.187:5000/users")
                .setTag("test1")
                .addHeaders("x-access-token",accessToken)
                .setPriority(Priority.LOW)
                .build()
                .getAsJSONArray(new JSONArrayRequestListener(){
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.e("users",response.toString());
                        for(int i=0;i<response.length();i++) {
                            try {
                                userArray.add(response.getJSONObject(i).getString("name"));
                                Log.e("yes",response.getJSONObject(i).getString("name"));
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

        ArrayAdapter<String> userAdapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,userArray);
        against.setAdapter(userAdapter);
        reviewer.setAdapter(userAdapter);

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                AndroidNetworking.post("http://192.168.43.187:5000/createcomplaint")
                        .addBodyParameter("category", category.getText().toString())
                        .addBodyParameter("title", title.getText().toString())
                        .addBodyParameter("against", against.getText().toString())
                        .addBodyParameter("body", details.getText().toString())
                        .addBodyParameter("reviewer", reviewer.getText().toString())
                        .setTag("test")
                        .addHeaders("x-access-token",accessToken)
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Toast.makeText(context,"Complaint has been created!",Toast.LENGTH_LONG).show();
                                Log.e("Response",response.toString());
                                finish();
                            }
                            @Override
                            public void onError(ANError error) {
                                Log.e("Error",error.toString());
                            }
                        });

            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
            }
        });

        CategorySTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speechToText();
                checkButton = "category";
            }
        });

        TitleSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speechToText();
                checkButton = "title";
            }
        });

        DetailsSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speechToText();
                checkButton = "details";
            }
        });

        AgainstSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speechToText();
                checkButton = "against";
            }
        });

        ReviewerSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                speechToText();
                checkButton = "reviewer";
            }
        });

        uploadAudio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(isRecording==false){

                    if(checkPermissions()==true){

                        audioSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"recordingAudio.mp3";

                        mediaRecorder = new MediaRecorder();
                        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
                        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
                        mediaRecorder.setOutputFile(audioSavePath);

                        try {
                            mediaRecorder.prepare();
                            mediaRecorder.start();
                            Toast.makeText(CreateComplaint.this,"Recording started!",Toast.LENGTH_SHORT).show();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }

                    }else{
                        ActivityCompat.requestPermissions(CreateComplaint.this,new String[]
                                {Manifest.permission.RECORD_AUDIO,Manifest.permission.WRITE_EXTERNAL_STORAGE},1);
                    }

                }
                else{

                    mediaRecorder.stop();
                    mediaRecorder.release();
                    Toast.makeText(CreateComplaint.this,"Recording stopped!",Toast.LENGTH_SHORT).show();
                    uploadAudio();

                }
            }
        });



        launcher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {
                if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="category"){
                    Intent data = result.getData();
                    category.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="title"){
                    Intent data = result.getData();
                    title.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="details"){
                    Intent data = result.getData();
                    details.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="against"){
                    Intent data = result.getData();
                    against.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
                else if(result.getResultCode() == RESULT_OK && result.getData()!=null && checkButton=="reviewer"){
                    Intent data = result.getData();
                    reviewer.setText(data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS).get(0));
                }
            }
        });

    }

    private void uploadAudio() {

        mProgress.setMessage("Uploading Audio....");
        mProgress.show();

        StorageReference filepath = mStorage.child("Audio").child("new_audio.mp3");
        Uri uri = Uri.fromFile(new File(audioSavePath));
        filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {

                mProgress.dismiss();
                Toast.makeText(CreateComplaint.this,"Audio has been uploaded!",Toast.LENGTH_SHORT).show();
                Log.e("Firebase Url",taskSnapshot.toString());

            }
        });

    }

    private void speechToText() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,"Start Speaking");
        launcher.launch(intent);
    }

    private boolean checkPermissions(){

        int first = ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.RECORD_AUDIO);
        int second = ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE);

        return first == PackageManager.PERMISSION_GRANTED && second == PackageManager.PERMISSION_GRANTED;

    }
}
package com.example.complainstapp;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
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
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.os.Environment;
import android.provider.MediaStore;
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
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Locale;

public class CreateComplaint extends AppCompatActivity {
    
    private ImageButton backButton;
    private Button submitButton;

    private String accessToken;
    private ArrayList<String> userArray;
    private static final int REQUEST_AUDIO_PERMISSION_CODE = 1;
    private static final int CAMERA_REQUEST_CODE = 2;
    private ActivityResultLauncher<Intent> TTSlauncher;
    private ActivityResultLauncher<Intent> cameralauncher;
    private String checkButton;
    private Context context;
    private MediaRecorder mediaRecorder;
    private String audioSavePath = null;
    private String imageSavePath = null;
    private boolean isRecording = false;
    private StorageReference mStorage;
    private ProgressDialog mProgress;
    private OutputStream outputStream;

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

                AndroidNetworking.post("http://192.168.0.109:5000/createcomplaint")
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

        audioSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"recordingAudio.3gp";
        imageSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"capturingImage.jpg";

        uploadAudio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(isRecording==false){

                    if(checkAudioPermissions()==true){

                        mediaRecorder = new MediaRecorder();
                        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
                        mediaRecorder.setOutputFile(audioSavePath);

                        try {
                            mediaRecorder.prepare();
                            mediaRecorder.start();
                            isRecording=true;
                            Toast.makeText(CreateComplaint.this,"Recording started!",Toast.LENGTH_SHORT).show();
                        } catch (IOException e) {
                            Log.e("Media error man",e.toString());
                        }

                    }else{
                        ActivityCompat.requestPermissions(CreateComplaint.this, new String[]{RECORD_AUDIO, WRITE_EXTERNAL_STORAGE}, REQUEST_AUDIO_PERMISSION_CODE);
                    }

                }
                else{

                    mediaRecorder.stop();
                    mediaRecorder.release();
                    Toast.makeText(CreateComplaint.this,"Recording stopped!",Toast.LENGTH_SHORT).show();
                    isRecording=false;
                    uploadAudio();

                }
            }
        });

        uploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                askCameraPermission();
            }
        });

        cameralauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {

                if(result.getResultCode() == RESULT_OK){

                    mProgress.setMessage("Uploading Image....");
                    mProgress.show();

                    Bitmap bitmap = (Bitmap) result.getData().getExtras().get("data");
                    File file = new File(imageSavePath);
                    try {
                        outputStream = new FileOutputStream(file);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
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

                    StorageReference filepath = mStorage.child("Photos").child("new_image.jpg");
                    Uri uri = Uri.fromFile(new File(imageSavePath));
                    filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {

                            mProgress.dismiss();
                            Toast.makeText(CreateComplaint.this,"Image has been uploaded!",Toast.LENGTH_SHORT).show();
                            Log.e("Firebase Url",taskSnapshot.toString());

                        }
                    });
                }

            }
        });



        TTSlauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
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
        TTSlauncher.launch(intent);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
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
            case CAMERA_REQUEST_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    openCamera();
                }
                break;
        }
    }


    private void openCamera() {
        Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cameralauncher.launch(camera);
    }

    private boolean checkAudioPermissions(){

        int first = ActivityCompat.checkSelfPermission(getApplicationContext(), RECORD_AUDIO);
        int second = ActivityCompat.checkSelfPermission(getApplicationContext(), WRITE_EXTERNAL_STORAGE);

        return first == PackageManager.PERMISSION_GRANTED && second == PackageManager.PERMISSION_GRANTED;

    }

    private void askCameraPermission() {

        if(ContextCompat.checkSelfPermission(this,Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.CAMERA},CAMERA_REQUEST_CODE);
        }
        else{
            openCamera();
        }

    }

}
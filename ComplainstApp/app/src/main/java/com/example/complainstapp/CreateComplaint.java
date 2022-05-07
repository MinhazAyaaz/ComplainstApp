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

    private static final int REQUEST_AUDIO_PERMISSION_CODE = 1;
    private static final int CAMERA_REQUEST_CODE = 2;
    private static final int FILE_REQUEST_CODE = 3;

    private String accessToken;
    private ArrayList<String> againstArrayNames;
    private ArrayList<String> againstArrayId;
    private ArrayList<String> reviewerArrayNames;
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

    private ActivityResultLauncher<Intent> TTSlauncher;
    private ActivityResultLauncher<Intent> cameralauncher;
    private ActivityResultLauncher<Intent> filelauncher;

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

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaint);
        context = this;

        againstArrayNames = new ArrayList<String>();
        againstArrayId = new ArrayList<String>();
        reviewerArrayNames = new ArrayList<String>();
        fileExists = false;
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

        AndroidNetworking.get("http://192.168.0.109:5000/againstusers")
                .setTag("test1")
                .addHeaders("x-access-token",accessToken)
                .setPriority(Priority.HIGH)
                .build()
                .getAsJSONArray(new JSONArrayRequestListener(){
                    @Override
                    public void onResponse(JSONArray response) {
                        for(int i=0;i<response.length();i++) {
                            try {
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

        ArrayAdapter<String> againstAdapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,againstArrayNames);
        against.setAdapter(againstAdapter);

        reviewer.setOnTouchListener(new View.OnTouchListener(){
            @Override
            public boolean onTouch(View v, MotionEvent event){
                reviewer.showDropDown();
                return false;
            }
        });

        against.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                against.showDropDown();
                return false;
            }
        });

        against.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                Log.e("beforeTextChanged",charSequence.toString());
            }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                Log.e("OnTextChanged",charSequence.toString());
            }
            @Override
            public void afterTextChanged(Editable editable) {
                AndroidNetworking.get("http://192.168.0.109:5000/reviewertoreview")
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

                ArrayAdapter<String> reviewerAdapter = new ArrayAdapter<String>(context,android.R.layout.simple_list_item_1,reviewerArrayNames);
                reviewer.setAdapter(reviewerAdapter);
            }
        });

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(category.getText().toString().isEmpty() || title.getText().toString().isEmpty() ||
                        against.getText().toString().isEmpty() || details.getText().toString().isEmpty()
                        || reviewer.getText().toString().isEmpty() || evidenceUrl == null){
                    Toast.makeText(context, "Please complete all fields and upload evidence!", Toast.LENGTH_LONG).show();
                }
                else {
                    AndroidNetworking.post("http://192.168.0.109:5000/createcomplaint")
                            .addBodyParameter("category", category.getText().toString())
                            .addBodyParameter("title", title.getText().toString())
                            .addBodyParameter("against", against.getText().toString())
                            .addBodyParameter("body", details.getText().toString())
                            .addBodyParameter("evidence", evidenceUrl)
                            .addBodyParameter("reviewer", reviewer.getText().toString())
                            .setTag("test")
                            .addHeaders("x-access-token", accessToken)
                            .setPriority(Priority.HIGH)
                            .build()
                            .getAsJSONObject(new JSONObjectRequestListener() {
                                @Override
                                public void onResponse(JSONObject response) {
                                    Toast.makeText(context, "Complaint has been created!", Toast.LENGTH_LONG).show();
                                    Log.e("Response", response.toString());
                                    finish();
                                }

                                @Override
                                public void onError(ANError error) {
                                    Log.e("Error", error.toString());
                                }
                            });
                }
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
                checkButton = "category";
                speechToText();
            }
        });

        TitleSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "title";
                speechToText();
            }
        });

        DetailsSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "details";
                speechToText();
            }
        });

        AgainstSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "against";
                speechToText();
            }
        });

        ReviewerSTT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkButton = "reviewer";
                speechToText();
            }
        });

        audioSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"recordingAudio.3gp";
        imageSavePath = Environment.getExternalStorageDirectory().getAbsolutePath()+"/"+"capturingImage.jpg";

        uploadAudio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }

                if(isRecording==false){

                    if(checkAudioPermissions()==true){

                        mediaRecorder = new MediaRecorder();
                        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
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

                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }

                askCameraPermission();
            }
        });

        uploadDocument.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(fileExists){
                    overwriteConfirm();
                    Toast.makeText(CreateComplaint.this,"Overwrite confirmed! Please click upload button again!",Toast.LENGTH_SHORT).show();
                }

                askFilePermission();
            }
        });



        cameralauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {

                if(result.getResultCode() == RESULT_OK){

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

                    mProgress.setMessage("Uploading Image....");
                    mProgress.show();

                    StorageReference filepath = mStorage.child("Photos").child("image"+System.currentTimeMillis()+".jpg");
                    Uri uri = Uri.fromFile(new File(imageSavePath));
                    filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            fileExists = true;
                            mProgress.dismiss();
                            Toast.makeText(CreateComplaint.this,"Image has been uploaded!",Toast.LENGTH_SHORT).show();
                            Log.e("Firebase Url",taskSnapshot.toString());
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

        filelauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
            @Override
            public void onActivityResult(ActivityResult result) {
                if(result.getResultCode() == RESULT_OK && result.getData()!=null){

                    mProgress.setMessage("Uploading File....");
                    mProgress.show();

                    Uri data = result.getData().getData();
                    StorageReference filepath = mStorage.child("Files").child("file-"+System.currentTimeMillis()+".pdf");
                    filepath.putFile(data).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            fileExists = true;
                            mProgress.dismiss();
                            Toast.makeText(CreateComplaint.this,"File has been uploaded!",Toast.LENGTH_SHORT).show();
                            Log.e("Firebase Url",taskSnapshot.toString());
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

    private void openCamera() {
        Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cameralauncher.launch(camera);
    }

    private void uploadFile() {
        Intent intent = new Intent();
        intent.setType("application/pdf");
        intent.setAction(intent.ACTION_GET_CONTENT);
        filelauncher.launch(intent);
    }

    private void uploadAudio() {

        mProgress.setMessage("Uploading Audio....");
        mProgress.show();

        StorageReference filepath = mStorage.child("Audio").child("recording"+System.currentTimeMillis()+".mp3");
        Uri uri = Uri.fromFile(new File(audioSavePath));
        filepath.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                fileExists = true;
                mProgress.dismiss();
                Toast.makeText(CreateComplaint.this,"Audio has been uploaded!",Toast.LENGTH_SHORT).show();
                Log.e("Firebase Url",taskSnapshot.toString());
                filepath.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                    @Override
                    public void onSuccess(Uri uri) {
                        evidenceUrl = uri.toString();
                    }
                });
            }
        });
    }

    private void speechToText() {

        if(checkButton.equals("against")){

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
            TTSlauncher.launch(intent);

        }
        else if(checkButton.equals("reviewer")){

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
            TTSlauncher.launch(intent);

        }
        else {

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            AlertDialog.Builder builder = new AlertDialog.Builder(this);

            builder.setTitle("Choose language");
            builder.setMessage("Select your preferred language for text to speech");

            builder.setPositiveButton("ENGLISH", new DialogInterface.OnClickListener() {

                public void onClick(DialogInterface dialog, int which) {

                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
                    TTSlauncher.launch(intent);
                    dialog.dismiss();

                }
            });

            builder.setNegativeButton("BENGALI", new DialogInterface.OnClickListener() {

                @Override
                public void onClick(DialogInterface dialog, int which) {

                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "bn-BD");
                    intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Start Speaking");
                    TTSlauncher.launch(intent);
                    dialog.dismiss();
                }
            });

            AlertDialog alert = builder.create();
            alert.show();

        }

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
            case FILE_REQUEST_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    uploadFile();
                }
        }
    }

    private boolean checkAudioPermissions(){

        int first = ActivityCompat.checkSelfPermission(getApplicationContext(), RECORD_AUDIO);
        int second = ActivityCompat.checkSelfPermission(getApplicationContext(), WRITE_EXTERNAL_STORAGE);

        return first == PackageManager.PERMISSION_GRANTED && second == PackageManager.PERMISSION_GRANTED;

    }

    private void askFilePermission(){
        boolean first = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED;
        boolean second = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED;

        if(!(first && second)){
            ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.READ_EXTERNAL_STORAGE},FILE_REQUEST_CODE);
        }
        else{
            uploadFile();
        }

    }

    private void askCameraPermission() {

        if(ContextCompat.checkSelfPermission(this,Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.CAMERA},CAMERA_REQUEST_CODE);
        }
        else{
            openCamera();
        }

    }

    private void overwriteConfirm(){

        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Confirm");
        builder.setMessage("Do you want to overwrite previous file?");

        builder.setPositiveButton("YES", new DialogInterface.OnClickListener() {

            public void onClick(DialogInterface dialog, int which) {

                fileExists = false;
                dialog.dismiss();

            }
        });

        builder.setNegativeButton("NO", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {

                fileExists = true;
                dialog.dismiss();
            }
        });

        AlertDialog alert = builder.create();
        alert.show();
    }

}
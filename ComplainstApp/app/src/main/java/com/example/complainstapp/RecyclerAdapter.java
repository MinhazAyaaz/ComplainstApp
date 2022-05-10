package com.example.complainstapp;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.complaintViewHolder> {

    private ArrayList<Complaint> complaints;
    private Context context;

    public RecyclerAdapter(ArrayList<Complaint> complaints) {
        this.complaints = complaints;
    }

    @NonNull
    @Override
    public complaintViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.card_layout,parent,false);
        context = parent.getContext();
        return new complaintViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerAdapter.complaintViewHolder viewHolder, int position) {
        Complaint complaint = complaints.get(position);
        viewHolder.bind(complaints.get(position));
        viewHolder.moreButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder builder = new AlertDialog.Builder(view.getRootView().getContext());
                View dialogView = LayoutInflater.from(view.getRootView().getContext()).inflate(R.layout.expanded_card,null);

                TextView id;
                TextView category;
                TextView against;
                TextView details;
                TextView title;
                TextView reviewer;
                Button evidence;
                Button editButton;
                ImageButton backButton;

                id = dialogView.findViewById(R.id.complaintID);
                category = dialogView.findViewById(R.id.categoryBody);
                against = dialogView.findViewById(R.id.againstBody);
                details = dialogView.findViewById(R.id.detailBody);
                title = dialogView.findViewById(R.id.titleBody);
                reviewer = dialogView.findViewById(R.id.reviewerBody);
                evidence = dialogView.findViewById(R.id.evidenceButton);
                editButton = dialogView.findViewById(R.id.editButton2);
                backButton = dialogView.findViewById(R.id.closeButton);

                id.setText(complaint.getId());
                category.setText(complaint.getCategory());
                against.setText(complaint.getAgainst());
                details.setText(complaint.getDescription());
                title.setText(complaint.getTitle());
                reviewer.setText(complaint.getReviewer());
                evidence.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Uri uri = Uri.parse(complaint.getEvidence()); // missing 'http://' will cause crash
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        context.startActivity(intent);
                    }
                });

                editButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Intent intent = new Intent(context, EditComplaint.class);
                        intent.putExtra("id",complaint.getId());
                        intent.putExtra("category",complaint.getCategory());
                        intent.putExtra("title",complaint.getTitle());
                        intent.putExtra("details",complaint.getDescription());
                        intent.putExtra("against",complaint.getAgainst());
                        intent.putExtra("reviewer",complaint.getReviewer());
                        intent.putExtra("evidence",complaint.getEvidence());
                        context.startActivity(intent);
                    }
                });

                builder.setView(dialogView);
                builder.setCancelable(true);
                final AlertDialog show = builder.show();

                backButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        show.dismiss();
                    }
                });
            }
        });
    }

    @Override
    public int getItemCount() {
        return complaints.size();
    }

    public class complaintViewHolder extends RecyclerView.ViewHolder{

        private TextView title;
        private TextView against;
        private TextView reviewer;
        private Button moreButton;

        public complaintViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.cardTitle);
            against = itemView.findViewById(R.id.cardAgainst);
            reviewer = itemView.findViewById(R.id.cardDescription);
            moreButton = itemView.findViewById(R.id.moreButton);
        }

        public void bind(Complaint complaints){
            title.setText(complaints.title);
            against.setText(complaints.against);
            reviewer.setText(complaints.reviewer);
        }

    }



}

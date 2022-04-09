import React from 'react';
import { useEffect } from 'react';

export default function CommentView( fetchedData ) {

    const [backendData, setBackEndData] = useState([]);
    React.useEffect(()=>{

        setBackEndData({
   
          complaintid: fetchedData.fetchedData.complaintid,
          creationdate: fetchedData.fetchedData.creationdate,
          status: fetchedData.fetchedData.status,
          title: fetchedData.fetchedData.title,
          against: fetchedData.fetchedData.against,
          category: fetchedData.fetchedData.category,
          body: fetchedData.fetchedData.body,
          reviewer: fetchedData.fetchedData.reviewer,
          createdby: fetchedData.fetchedData.createdby,
        })
        
       
     }, [])
   
  return (
    <div>CommentView</div>
  )
}

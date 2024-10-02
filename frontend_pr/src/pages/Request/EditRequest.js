import { useEffect,useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate,useParams } from 'react-router-dom';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

const EditRequest = () => {
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [redirect,setRedirect]=useState(false);

    const {id}= useParams();

    useEffect(()=>{
        fetch(`http://localhost:4000/pull-request/${id}`).then(response=>{
            response.json().then(info=>{
                setTitle(info.title);
                setContent(info.description);
            })
        })
    },[])

    const handleEditFormat=async(e)=>{
        e.preventDefault();
        
        const response=await fetch(`http://localhost:4000/pull-request/${id}`,{
            method:'PUT',
            body:JSON.stringify({title,content}),
            headers:{'Content-Type':'application/json'},
            credentials:'include',
        })
        if(response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/pull-request/'+id} />
    }

    console.log(title);
    console.log(content);
  return (
    <div className='newPost-body'>
    <form className="newPost" onSubmit={handleEditFormat}>

        <h1 className='newPost-head'>Update Request</h1>
        <div className="input-group newpost">
            <input type="text" 
                    className="form-control" 
                    placeholder="Title" 
                    aria-label="Title" 
                    aria-describedby="addon-wrapping"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}/>
        </div>
        
        <div className='newpost text-area'>
            <ReactQuill  className="quill" 
                        value={content} 
                        onChange={newValue=>setContent(newValue)}
                        modules={modules}
                        formats={formats}
            ></ReactQuill>
        </div>
        <div className='newpost'>
            <button className="btn btn-outline-secondary newPost-btn" type="submit">Update</button>
        </div>
        
    </form>
    </div>
  )
}

export default EditRequest;
import TextareaAutosize from 'react-textarea-autosize';

const BasicInput = ( {disp, placeholder, label, name, value, onChange} ) => {

    return (
        <div className='input-container'>
            <label className="label" htmlFor={name}>{label}</label>
            {disp === 'text' ?
            <TextareaAutosize placeholder={placeholder} name={name} value={value} onChange={onChange}/>
            :
            <input placeholder={placeholder} type={disp} name={name} id={name} value={value} onChange={onChange}/>
            }
        </div>
    )


}

export default BasicInput;
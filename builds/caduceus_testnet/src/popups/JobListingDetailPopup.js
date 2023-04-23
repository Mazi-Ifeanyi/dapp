import { useState } from 'react';

import classes from '../styles/popups/JobListingDetailPopup.module.css';
import backIcon from '../assets/back.png';
import moreIcon from '../assets/more.png';
import dropdown from '../assets/dropdown.png';
import PostJobPopup from "./PostJobPopup";
import ArchivePostingPopup from "./ArchivePostingPopup";


const JobListingDetailPopup = (props) =>{
    const { setShowJobDetail } = props;
    const [ showPopup, setShowPopup ] = useState(false);
    const [ openPostJob, setOpenPostJob ] = useState(false);
    const [ openArchive, setOpenArchive ] = useState(false);
    

    const editJobHandler = () =>{
        setOpenPostJob(true);
    }

    const archiveJobHandler = () =>{
        setOpenArchive(true);
    }

    
    return(
        <section className={classes.parent}>
            {openPostJob && <PostJobPopup formToOpen='EDIT_DRAFT' setOpenPostJob={setOpenPostJob} />}
        {openArchive && <ArchivePostingPopup setOpenArchive={setOpenArchive} setShowJobDetail={setShowJobDetail} />}
            <div className={classes.box} onClick={(e)=>e.stopPropagation()}>
                <header className={classes.header}>
                    <img src={backIcon} alt='' onClick={()=>setShowJobDetail(false)} />
                    <p>Listing Details</p>
                    <span className={classes.moreContainer} 
                         tabIndex={1}
                         onFocus={()=>setShowPopup(true)}
                         onBlur={()=>setShowPopup(false)}
                         >
                        <img src={moreIcon} alt='' />
                   {showPopup &&<div className={classes.dropdownContainer}>
                        <img src={dropdown} alt='' />
                        <p onClick={editJobHandler}>Edit Listing</p>
                        {/* <p>Report Listing</p> */}
                        <p onClick={archiveJobHandler}>Archive Job</p>
                    </div>}
                    </span>
                </header>
                <div className={classes.content}>
                    <h2>Listed Date And Time</h2>
                    <p>01 April 2023, 07:34:14</p>
                </div>
                <div className={classes.content}>
                    <h2>Expiry Date And Time</h2>
                    <p>01 April 2023, 07:34:14</p>
                </div>
                <div className={classes.content}>
                    <h2>Job Description</h2>
                    <p>UI/UX Designer</p>
                </div>
                <div className={classes.content}>
                    <h2>Applicants</h2>
                    <p>50</p>
                </div>
                <div className={classes.content}>
                    <h2>Status</h2>
                    <p style={{ color: '#159500'}}>Listed</p>
                </div>
            </div>
        </section>
    )
}

export default JobListingDetailPopup;
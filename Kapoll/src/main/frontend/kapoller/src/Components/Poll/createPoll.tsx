import React, {useState, ChangeEvent, useEffect} from "react";
import PollService from "../../services/PollService";
import PollData from "../../types/Poll";
import KapollerService from "../../services/KapollerService";
import '../../styles/ListOfPolls.css'
import {useNavigate} from "react-router-dom";


const AddPoll: React.FC = () => {
    const initialPoll = {
        title: "",
        question: "",
        time: 0
    };
    let userId: string | null = sessionStorage.getItem('userId')
    console.log('in create poll ' + userId)
    const [poll, setPoll] = useState<PollData>(initialPoll)
    const [submitted, setSubmitted] = useState<boolean>(false);
    let navigate = useNavigate();
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        if (!authToken) {
            console.log('navigating to login because authtoken is false')
            navigate('/login')
        }
    },[])
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setPoll({id:0,...poll, [name]: value});
    };

    const savePoll = () => {
        var data = {
            title: poll.title,
            question: poll.question,
            time: poll.time
        };

        PollService.create(data)
            .then(async(response) => {
                setSubmitted(true);
                return response.json().then((result) => {
                    console.log(result.id)
                    console.log(poll)
                    var newData:PollData = {
                        id: result.id,
                        title: poll.title,
                        question: poll.question,
                        time: poll.time}
                    if(userId){KapollerService.addPoll(userId, [newData])
                        .then((response) => {console.log(response.headers)})
                        .catch((e: Error) => console.log(e));
                        setSubmitted(true);}
                })
            })
            .catch((e: Error) => {
                console.log(e)
            });
    };
    const newPoll = () => {
        setPoll(initialPoll);
        setSubmitted(false)
    };
    return (
        <div className="submit-form font">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className={'btn btn-success'} onClick={newPoll}>
                        Add another poll
                    </button>
                </div>
            ) : (
                <div>
                    <div className={'form-group'}>
                        <label htmlFor="title">Title</label>
                        <input type="text"
                               className={"form-control"}
                               id={"title"}
                               required
                               value={poll.title}
                               onChange={handleInputChange}
                               name={"title"}
                                defaultValue={""}/>

                    </div>
                    <div className="form-group">
                        <label htmlFor="question ">Question</label>
                        <input
                            type="text"
                            className="form-control"
                            id="question"
                            required
                            value={poll.question}
                            onChange={handleInputChange}
                            name="question"
                            defaultValue={""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="time ">Time in seconds</label>
                        <input
                            type="text"
                            className="form-control"
                            id="time"
                            required
                            value={poll.time}
                            onChange={handleInputChange}
                            name="time"
                        defaultValue={0}/>
                    </div>
                    <button onClick={savePoll} className="btn green smallPollFont">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddPoll;
import React, { useState } from 'react'
import { v4 as uuid } from "uuid"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuid();
        setRoomId(id)
        toast.success("Created a new room");
    }

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Room ID and Username is required")
            return;
        }

        //redirecting
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        })
    }

    const handleEnter = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className="formWrapper">
                <img
                    className='homePageLogo'
                    src="./code-sync.png"
                    alt="logo"
                />
                <h4 className='mainLabel'>
                    Paste invitation ROOM ID
                </h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='ROOM ID'
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleEnter}
                    />
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='First Name'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleEnter}
                    />
                    <button
                        className='btn joinBtn'
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <span className='createInfo'>If you don,t have an Invite then create&nbsp;
                        <a
                            onClick={createNewRoom}
                            href="/"
                            className='createNewBtn'>new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with 💛 by <a href="https://github.com/debanjan-exe">Debanjan</a></h4>
            </footer>
        </div>
    )
}

export default Home
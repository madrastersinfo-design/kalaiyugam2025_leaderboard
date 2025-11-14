import {Routes, Route} from 'react-router-dom'
import SubmissionForm from "./SubmissionForm.tsx";
import Leaderboard from "./Leaderboard.tsx";


function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<SubmissionForm/>}/>
                <Route path="/leaderboard" element={<Leaderboard/>}/>
            </Routes>
        </>
    )
}

export default App

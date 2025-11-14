import { CSSProperties, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import Logo from "./assets/kalaiyugam.svg"
import madrasters from "./assets/madrasters-logo.svg"
// Decorative corner flowers – add your actual files under src/assets and update names if needed
import flowerLeft from "./assets/mara.png"
import flowerRight from "./assets/conc.png"

function SubmissionForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        instaId: '',
        date: '15',
        postLink: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const modalStyles: CSSProperties = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '16px'
    };

    const successModalStyles: CSSProperties = {
        background: '#FFFFFF',
        padding: '28px 32px',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '360px',
        width: '100%'
    };

    const successContentStyles: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: '#111827'
    };

    const successTitleStyles: CSSProperties = {
        fontFamily: '\'Pixelify Sans\', cursive',
        backgroundImage: 'linear-gradient(#B189E5, #E579E3)',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        fontSize: '26px',
        marginBottom: '16px'
    };

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjthWzRuXO6H-Ozx49tg5hd0lJE8qMS0XAEs7Di7JGnuFP5SbuclPzwOkvWe30B0Y3_A/exec";




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString()
                })
            });

            setFormData({
                fullName: "",
                instaId: "",
                date: "15",
                postLink: ""
            });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Submission failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="page">
                <div className="background">
                    {/* Decorative Flowers INSIDE card */}
                    <img className="flower-left" src={flowerLeft} alt="" aria-hidden="true" />
                    <img className="flower-right" src={flowerRight} alt="" aria-hidden="true" />
                    <img className="brand-logo" src={madrasters} alt="Madrasters" />
                    <img className="title-logo" src={Logo} alt="Kalaiyugam" />
                    <div className="subText">
                        🌸 This is your gateway to blooming in Kalaiyugam 2025 Leaderboard! Submit your Thamizh Typography design daily before 9:00 P.M. and keep your creative streak alive. Every submission brings you one step closer to recognition, features, and exciting surprises!  🔥 Stay consistent, follow the guidelines, and keep the spirit alive! Hit ‘Submit’ and let your creativity bloom with Flowers (மலர்கள்)! 🌼
                    </div>
                    <button
                        type="button"
                        className="leaderboard-nav-button"
                        onClick={() => navigate('/leaderboard')}
                    >
                        View Leaderboard 🌺
                    </button>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            name="instaId"
                            value={formData.instaId}
                            onChange={handleChange}
                            placeholder="Insta ID"
                            required
                            disabled={isLoading}
                        />
                        <select
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="15">Nov 15 -  காந்தள் (Kanthal)</option>
                            <option value="16">Nov 16 - வாடாமல்லி (Vadamalli)</option>
                            <option value="17">Nov 17 - செம்பருத்தி (Sembaruthi)</option>
                            <option value="18">Nov 18 - கனகாம்பரம் (Kanakambaram)</option>
                            <option value="19">Nov 19 - பாரிஜாதம் (Paarijatham )</option>
                            <option value="20">Nov 20 - ஆவாரம்பூ (Aavaram )</option>
                            <option value="21">Nov 21 - தும்பை (Vadamalli)</option>
                        </select>
                        <input
                            type="text"
                            name="postLink"
                            value={formData.postLink}
                            onChange={handleChange}
                            placeholder="Post Link"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`level-up-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-text">Submitting...</span>
                            ) : (
                                'Submit’ and Bloom Up 🔥'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {showSuccess && (
                <div className="modal" style={modalStyles}>
                    <div className="success-modal" style={successModalStyles}>
                        <div className="success-content" style={successContentStyles}>
                            <div className="success" style={successTitleStyles}>Submission Successful!</div>
                            <p className="textModal">You did it! Your challenge submission has been received.</p>
                            <p className="subTextModal">One step closer to becoming a MADX Champion!</p>
                            <p className="subTextModal">Ready for the next challenge? Keep designing!</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SubmissionForm

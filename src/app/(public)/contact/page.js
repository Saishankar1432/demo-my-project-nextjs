import Image from "next/image";
export default function Contact() {
    const contact = [
        {
            id: 1,
            name: "",
            email: "",
            phone: "",
        }
    ]
    return (
        <div className="container">
            <div className="section-row">
                <div className="image-content">
                    <Image
                        src="/assets/image.png"
                        alt="image"
                        className="section-img"
                        width={500}
                        height={400}
                    />
                </div>
                <div className="text-content">
                    <form className="contact-form">
                        <h2>Get in Touch</h2>
                        <div className="form-group">
                            <input type="text" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Your Email" required />
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder="Your Phone" />
                        </div>
                        <div className="form-group">
                            <textarea rows="4" placeholder="Your Message" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
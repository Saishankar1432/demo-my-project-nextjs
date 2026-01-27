import Image from "next/image";
export default function Services() {
    return (
        <div className="container">
            {/* Section 1: Text Left, Image Right */}
            <div className="section-row">
                <div className="text-content">
                    <h1>The Old English Sheepdog</h1>
                    <p>
                        The Old English Sheepdog is a lovable and iconic breed known for its thick, shaggy double coat
                        and gentle, easygoing nature. Historically bred for driving sheep and cattle to market, these
                        "bobtails" are as sturdy and hardworking as they are affectionate, serving as both capable
                        farmhands and devoted family companions. Their most striking feature is their long, profuse
                        hair that often covers their eyes, giving them a whimsical and charming appearance that masks
                        a keen intelligence and playful spirit.
                    </p>
                </div>
                <div className="image-content">
                    <Image
                        src="/assets/puppy.png"
                        alt="Lion Majestic"
                        className="section-img"
                        width={500}
                        height={400}
                    />
                </div>
            </div>

            {/* Section 2: Image Left, Text Right */}
            <div className="section-row">
                <div className="image-content">
                    <Image
                        src="/assets/puppy.png"
                        alt="Lion Pride"
                        className="section-img"
                        width={500}
                        height={400}
                    />
                </div>
                <div className="text-content">
                    <h1>The Shaggy Sentinel</h1>
                    <p>
                        Beyond their fluffy exterior, Old English Sheepdogs are celebrated for their distinctive "pot-
                        cas" bark—a deep, resonant sound that sounds like two pots clanking together. They are highly
                        adaptable and thrive on human interaction, often following their owners from room to room
                        with a lighthearted "clownish" energy. Whether trekking through a snowy forest or lounging at
                        home, their combination of protective instincts and a warm, bubbly personality makes them
                        true legends of the pastoral world.
                    </p>
                </div>
            </div>
            {/* secttion-3 */}
            <div className="center-row">
                <div className="center-img">
                    <Image
                        src="/assets/squerl.png"
                        alt="squerl"
                        className="snow-img"
                        width={500}
                        height={400}
                    />
                </div>
                <div className="content">
                    <h1>The Eastern Gray Squirrel</h1>
                    <p>
                        The Eastern Gray Squirrel is a nimble and clever rodent, widely recognized as a symbol of
                        resourcefulness and energy in both forests and urban parks. These small mammals are master
                        climbers, equipped with sharp claws and powerful hind legs that allow them to leap between
                        branches and descend tree trunks head-first with incredible agility. Their most identifying
                        feature is their large, bushy tail, which serves many purposes: it acts as a rudder for balance
                        while jumping, a warm blanket in the winter, and a signaling tool to communicate with other squirrels.
                    </p>
                    <p>
                        Beyond their playful antics, squirrels play a vital role in their ecosystems as "accidental
                        gardeners." Known for their habit of "scatter-hoarding," they bury thousands of nuts and
                        seeds—such as acorns and walnuts—to prepare for the lean winter months. Since they often
                        forget the exact location of some of these caches, those buried seeds frequently sprout into
                        new trees, helping to regenerate and expand the forest. With their keen intelligence, twitching
                        noses, and tireless work ethic, squirrels are the bustling architects of the green world.
                    </p>
                </div>
            </div>

        </div>
    )
}
import Image from "next/image";
export default function About() {
    return (
        <div className="container">
            {/* Section 1: Image Left, Text Right */}
            <div className="section-row">
                <div className="image-content">
                    <Image
                        src="/assets/goat.png"
                        alt="Lion Pride"
                        className="section-img"
                        width={500}
                        height={400}
                    />
                </div>
                <div className="text-content">
                    <h1>Greatest Of All Time</h1>
                    <p>The term GOAT (Greatest of All Time) is used to describe an individual who stands above
                        all others in their field through unmatched excellence, consistency, and impact. A GOAT is
                        not defined by a single achievement but by a legacy built over time—record-breaking
                        performances, dominance in critical moments, and the ability to perform under immense
                        pressure when it matters most.</p>
                    <p>
                        True GOATs combine exceptional skill with mental strength, discipline, and an unrelenting
                        work ethic. They redefine standards, inspire generations, and change how the game, craft,
                        or profession is played. Beyond talent, a GOAT earns respect through leadership, resilience
                        in adversity, and the ability to rise after failures. Whether in sports, music, technology, or
                        any field of greatness, a GOAT is remembered not just for winning—but for transforming
                        history and setting a benchmark that others can only chase.</p>
                </div>
            </div>
            {/* Section 2: Text Left, Image Right */}
            <div className="section-row">
                <div className="text-content">
                    <h1>Greatest Of All Time</h1>
                    <p>
                        The term GOAT (Greatest of All Time) is used to describe an individual who stands above
                        all others in their field through unmatched excellence, consistency, and impact. A GOAT is
                        not defined by a single achievement but by a legacy built over time—record-breaking
                        performances, dominance in critical moments, and the ability to perform under immense
                        pressure when it matters most.
                    </p>
                    <p>
                        True GOATs combine exceptional skill with mental strength, discipline, and an unrelenting
                        work ethic. They redefine standards, inspire generations, and change how the game, craft,
                        or profession is played. Beyond talent, a GOAT earns respect through leadership, resilience
                        in adversity, and the ability to rise after failures. Whether in sports, music, technology, or
                        any field of greatness, a GOAT is remembered not just for winning—but for transforming
                        history and setting a benchmark that others can only chase.
                    </p>
                </div>
                <div className="image-content">
                    <Image
                        src="/assets/goat.png"
                        alt="Lion Majestic"
                        className="section-img"
                        width={500}
                        height={400}
                    />
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
    );
}

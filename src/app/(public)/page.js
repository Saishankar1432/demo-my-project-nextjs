import "../globals.css";
import Image from 'next/image';

export const metadata = {
  title: 'My project',
  description: 'Discover the wild life',
  openGraph: {
    title: 'My project',
    description: 'This the Wild life ',
    type: 'website',
    url: 'https://myproject.com',
    images: [
      {
        url: '/assets/lion.png',
        width: 500,
        height: 500,
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="container">
      {/* Section 1: Text Left, Image Right */}
      <div className="section-row">
        <div className="text-content">
          <h1>King of the Jungle</h1>
          <p>
            Lions are majestic and powerful animals that stand as timeless symbols of strength,
            courage, and leadership in the wild. As apex predators, they play a crucial role in
            maintaining the balance of their ecosystems by regulating prey populations and ensuring
            the health of grassland habitats.
          </p>
          <p>
            Known for their commanding presence, lions are easily recognized by their distinctive
            manes, which vary in color and size and often reflect age, health, and dominance.
          </p>
        </div>
        <div className="image-content">
          <Image
            src="/assets/lion.png"
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
            src="/assets/lion.png"
            alt="Lion Pride"
            className="section-img"
            width={500}
            height={400}
          />
        </div>
        <div className="text-content">
          <h1>Pride and Power</h1>
          <p>
            Unlike most big cats, lions are highly social animals, living in structured groups called
            prides. This social nature allows them to hunt cooperatively, protect their territory, and
            raise their young together.
          </p>
          <p>
            Their deep roars, echoing across the savanna, serve as powerful declarations of territory
            and unity. With a blend of raw power, strategic teamwork, and regal grace, lions truly
            earn their title as the Kings of the Jungle.
          </p>
        </div>
      </div>

      {/* secttion-3 */}
      <div className="center-row">
        <div className="center-img">
          <Image
            src="/assets/snow.png"
            alt="snow"
            className="snow-img"
            width={500}
            height={400}
          />
        </div>
        <div className="content">
          <h1>The Snow Leopard</h1>
          <p>
            The Snow Leopard is one of the world’s most elusive and mysterious big cats, often called the
            ghost of the mountains. These magnificent predators are perfectly adapted to the harsh, rocky
            environments of Central and South Asia, roaming high-altitude terrains where temperatures can
            drop far below freezing.
          </p>
          <p>
            Their thick, smoky-gray fur, marked with dark rosettes, provides exceptional camouflage against
            the rocky slopes, making them incredibly difficult to spot. With their powerful build, large paws
            that act like snowshoes, and a long, thick tail used for balance and warmth, they are true masters
            of their alpine domain.
          </p>
        </div>
      </div>
    </div>
  )
}
import Image from "next/image";
import julia from "../../../public/julia.jpg";

export default async function About() {
  return (
    <div className="p-8 m-8 flex flex-col items-center lg:justify-center h-full lg:mt-20">
      <div className="flex flex-col gap-8" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <Image
            src={julia}
            alt="Julia Finocchiaro"
            height={700}
            style={{ objectFit: "contain" }}
          />
          <div>
            <p>
              Julia Finocchiaro is a concert, event, and portrait photographer
              based in Boston, MA. When she&apos;s not in the pit at her
              favorite artists&apos; shows, you&apos;ll find her in front of the
              barricade capturing the magic of live music.
            </p>
            <br />
            <p>
              Some of her previous clients include <b>Tessa Violet</b>,{" "}
              <b>The Kid LAROI</b>, <b>Rise Against</b>,{" "}
              <b>Foundations Management (Zolita, The Brook and the Bluff)</b>,{" "}
              <b>We Three</b>, <b>Solence</b>, <b>Girli</b> and more. She has
              shot at major festivals including <b>Gov Ball</b>,{" "}
              <b>Boston Calling</b>, and <b>Head in the Clouds NYC</b>
            </p>
            <br />
            <p>
              Her work has been featured in various publications, including{" "}
              <a
                href="https://www.instagram.com/unclearmag/?hl=en"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                <b>Unclear Magazine</b>
              </a>
              , <b>New England Sounds</b>, <b>The Huntington News</b>,{" "}
              <b>ECHO Magazine</b>,{" "}
              <a
                href="https://www.instagram.com/thephotoladies/"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                <b>The Photo Ladies</b>
              </a>
              ,{" "}
              <a
                href="https://respectyouryoungers.com/author/julia/"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                <b>Respect Your Youngers</b>
              </a>
              , and many more. She served as photo editor for Northeastern
              University&apos;s{" "}
              <a
                href="https://www.tastemakersmag.com/photos?author=6179a643aedc4374d5fd60a8"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <b>Tastemakers Magazine</b>{" "}
              </a>
              for two years while she was a student there.
            </p>
            <br />
            <br />
            <p>
              <b>Selected Written Work:</b>
            </p>
            <ul>
              <li>
                <a
                  href="https://huntnewsnu.com/78040/lifestyle/reviews/bad-bunny-returns-to-boston-with-the-most-wanted-show/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Show Review: Bad Bunny&apos;s Most Wanted Tour{" "}
                  <i>(The Huntington News)</i>
                </a>
              </li>
              <li>
                <a
                  href="http://respectyouryoungers.com/reviews/noah-kahan-took-89-to-boston-and-sold-out-fenway-park/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Show Review: Noah Kahan @ Fenway Park{" "}
                  <i>(Respect Your Youngers)</i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tastemakersmag.com/show-reviews/taylor-swift-gillette"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Show Review: Taylor Swift&apos;s The Eras Tour{" "}
                  <i>(Tastemakers Magazine)</i>
                </a>
              </li>
              <li>
                <a
                  href="https://newenglandsounds.com/2023/08/30/live-review-photos-bruce-springsteen-and-the-e-street-band-08-26-23/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Show Review: Bruce Springsteen @ Gillette Stadium{" "}
                  <i>(New England Sounds)</i>
                </a>
              </li>
              <li>
                <a
                  href="https://respectyouryoungers.com/reviews/valley-boston-2024/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Show Review: Valley @ House of Blues{" "}
                  <i>(Respect Your Youngers)</i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center">
          Looking for something specific? Feel free to send over your inspo,
          Pinterest boards, or color palettes!
        </p>
        <p className="text-center">
          While based primarily in <b>Boston, MA</b> and <b>NYC</b>, she is also
          available for travel.
        </p>
        <a
          href="mailto:julia@jfino.photo.com"
          className="hover:underline self-center"
        >
          <p className="font-semibold mb-16 lg:mb-0">julia@jfinophoto.com</p>
        </a>
      </div>
    </div>
  );
}

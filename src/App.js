/**
 * Main access point for the sliding gallery app.
 * The data below is added to test the SlidingGallery component
 * in various configurations.
 */

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { VARIANTS } from './const';
import styles from './App.module.css';
import SlidingGallery from './components/SlidingGallery';

function App() {
  /** Sample text to display in different items */
  const SAMPLE_TEXT = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Vivamus lacinia sollicitudin congue.',
    'Aliquam mollis ornare tellus, scelerisque consequat leo laoreet id.',
    'Etiam elit velit, pretium sed tincidunt et, lacinia a lorem.',
    'Pellentesque sem augue, luctus id lorem at, tincidunt elementum odio.',
    'Suspendisse consectetur ex in ex commodo tincidunt.',
    'Donec convallis leo dolor, eget varius quam tincidunt eget.',
  ];

  /** Fetch some data from a public API to test asynchronous display of images */
  const [cats, setCats] = useState();
  useEffect(() => {
    const getCats = async () => {
      const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
      if (res?.ok) {
        const data = await res.json();
        setCats(data);
      }
    }
    getCats();
  }, []);

  return (
    <div className="App">
      <p>Test 1: strings</p>
      <SlidingGallery
        items={SAMPLE_TEXT}
      />

      <p>Test 2: strings with inset</p>
      <SlidingGallery
        items={SAMPLE_TEXT}
        variant={VARIANTS.INSET}
      />

      <p>Test 3: strings with rendering function</p>
      <SlidingGallery
        items={SAMPLE_TEXT}
        renderItem={(data) => (
          <div className={styles.loremText}>
            {data}
          </div>
        )}
      />

      <p>Test 4: large amount of items</p>
      <SlidingGallery
        items={new Array(10000).fill().map(() => uuidv4())}
      />

      <p>Test 5: few items in list (test resizing)</p>
      <SlidingGallery
        items={[]}
      />
      <SlidingGallery
        items={['Item1']}
      />
      <SlidingGallery
        items={['Item1', 'Item2']}
      />
      <SlidingGallery
        items={['Item1', 'Item2', 'Item3']}
      />

      <p>Test 6: no list (simulate loading)</p>
      <SlidingGallery
        items={null}
      />

      <p>Test 7: async fetch of images</p>
      <SlidingGallery 
        items={cats}
        renderItem={(data) => (
          <img
            className={styles.cats}
            src={data.url}
            alt={`Cat ${data.id}`}
          />
        )}
      />
    </div>
  ); 
}

export default App;

/**
 * Main sliding gallery Component.
 * It comprises of 3 optional props:
 * - items: the list of items to display
 * - renderItem: a function to render each item independently,
 *   it can be used to decouple the raw data from it's rendering phase
 * - variant: type of variant to display
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { VARIANTS, UPPER_BOUND_PX } from '../../const';
import styles from './SlidingGallery.module.css';

const SlidingGallery = ({
  items,
  renderItem,
  variant,
}) => {
  const [index, setIndex] = useState(0);
  const [displayAmount, setDisplayAmount] = useState();

  /**
   * Update the number of displayed items and the current index
   * when the items change or the user resizes the window.
   */
  const updateDisplayAmount = useCallback(() => {
    if (!items) {
      return;
    }

    const { innerWidth: width } = window;

    let amount = 4;
    if (width <= UPPER_BOUND_PX.SMALL) {
      amount = 1;
    } else if (width <= UPPER_BOUND_PX.MEDIUM) {
      amount = 2;
    }

    setDisplayAmount(amount);
    setIndex((idx) => Math.min(idx, Math.max(items.length - amount, 0)));
  }, [items]);

  /**
   * Change amount of displayed items: add listener to update on screen resize
   */
  useEffect(() => {
    window.addEventListener('resize', updateDisplayAmount);
    return () => window.removeEventListener('resize', updateDisplayAmount);
  }, [updateDisplayAmount]);

  /**
   * Change amount of displayed items: update when the list of items change
   */
   useEffect(() => {
    updateDisplayAmount();
  }, [items, updateDisplayAmount]);

  if (!items) {
    return (
      <div className={styles.slidingGalleryContainer}>
        Loading...
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className={styles.slidingGalleryContainer}>
        No items to show
      </div>
    )
  }

  const isLeftArrowDisabled = items.length <= displayAmount || index === 0;
  const isRightArrowDisabled = items.length <= displayAmount || index === items.length - displayAmount;

  return ( 
    <div className={styles.slidingGalleryContainer}>
      <div className={classNames({
          [styles.slidingGalleryList]: true,
          [styles.inset]: variant === VARIANTS.INSET,
        })}>
        {items
          .filter((item, idx) => {
            const min = index;
            const max = index + displayAmount - 1;
            return idx >= min && idx <= max;
          })
          .map((item) => <div
              key={item?.id ?? uuidv4()}
              className={styles.galleryItem}
            >
              {renderItem?.(item) ?? item}
            </div>
          )
        }
      </div>

      {!isLeftArrowDisabled && (
        <button
          className={classNames([styles.arrow, styles.arrowLeft])}
          onClick={() => setIndex(index - 1)}
        >
          &lt;
        </button>
      )}

      {!isRightArrowDisabled && (
        <button
          className={classNames([styles.arrow, styles.arrowRight])}
          onClick={() => setIndex(index + 1)}
        >
        &gt;
      </button>
      )}
    </div>
  );
}

SlidingGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  renderItem: PropTypes.func,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
};

SlidingGallery.defaultProps = {
  items: null,
  renderItem: null,
  variant: VARIANTS.FULL,
};

export default SlidingGallery;

/**
 * Provides an interface os a GA command list.
 */
export type DataLayer = (string | Record<string, string>)[];

/**
 * A string that represents a default GA action used by Google to generate e-commerce inteligence.
 *
 * You can provide a custom string as well.
 * @deprecated use lib/enums/ga-action.enum.ts instead
 */
export type GaAction =
  | 'view_search_results'
  | 'add_payment_info'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'begin_checkout'
  | 'checkout_progress'
  | 'generate_lead'
  | 'login'
  | 'purchase'
  | 'refund'
  | 'remove_from_cart'
  | 'search'
  | 'select_content'
  | 'set_checkout_option'
  | 'share'
  | 'sign_up'
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion';

/**
 * Google Analytics GTagFn call signature
 */
export type GtagFn = (...args: (string | Record<string, string>)[]) => {};

export const CATEGROIES = [ 'Adventure',
                            'Comedy',
                            'Drama',
                            'Fantasy',
                            'History',
                            'Horror',
                            'Inspirational',
                            'Mystery',
                            'Post-Apocalyptic',
                            'Romance',
                            'Science Fiction',
                            'Thriller',
                            'Philosophy',
                            'Biography',
                            'Self-Help',
                            'Health',
                            'Travel',
                            'Cooking',
                            'Art',
                            'Western']

export const COPY_STATUS_AVAILABLE = 'Available'
export const COPY_STATUS_BORROWED = 'Borrowed'
export const COPY_STATUS_RESERVED = 'Reserved'
export const COPY_STATUS_LOST = 'Lost'
export const COPY_STATUS_DAMAGED = 'Damaged'

export const COPY_STATUS = [
    COPY_STATUS_AVAILABLE,
    COPY_STATUS_BORROWED,
    COPY_STATUS_RESERVED,
    COPY_STATUS_LOST,
    COPY_STATUS_DAMAGED
]

export const BORROW_STATUS_AVAILABLE = 'Available'
export const BORROW_STATUS_BORROWED = 'Borrowed'
export const BORROW_STATUS_RESERVED = 'Reserved'
export const BORROW_STATUS_OVERDUE = 'Overdue'
export const BORROW_STATUS_RETURNED = 'Returned'

export const BORROW_STATUS = [
    BORROW_STATUS_AVAILABLE,
    BORROW_STATUS_BORROWED,
    BORROW_STATUS_RESERVED,
    BORROW_STATUS_OVERDUE,
]


export const ROLES = ['Admin', 'Visitor']
const today = new Date()
export const BORROW_DUE_DATE = today.setDate(today.getDate() + 15).toLocaleString();
export const BORROW_RENEWAL_DAYS = 7;
export const READY_FOR_PICKUP_TIME = 2; // hours
export const PICKUP_TIME_LIMIT = 48; // hours
export const MINIMUM_DAYS_FOR_RENEW = 3
const { Book, User } = require('../models');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

                return userData;
            }
            throw new AuthenticationError('You are not logged in');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
       login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Email and password do not match');
            }

            const token = signToken(user);

            return { token, user };
       },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdandUpdate(
                    { _id: context.user._id },
                    { $push: { books: bookData }},
                    { new: true }
                );

                return updateUser;
            }

            throw new AuthenticationError('You must be logged in to perform this action');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdandUpdate(
                    { _id: context.user._id },
                    { $pull: { books: { bookId }}},
                    { new: true }
                );

                return updateUser;
            }

            throw new AuthenticationError('You must be logged in to perform this action');
        },
    },
};

module.exports = resolvers;
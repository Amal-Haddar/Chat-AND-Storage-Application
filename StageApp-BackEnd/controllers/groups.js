const httpStatus = require("http-status-codes");
const Joi = require("joi");
const moment = require("moment");

const Group = require("../models/groupModels");
const User = require("../models/userModels");
const Helpers = require("../Helpers/helpers");

module.exports = {

    async GetAllGroups(req, res) {
        await Group.find({})
          .populate("creatorId")
          .populate("members.userId")
          .then((result) => {
            res.status(httpStatus.OK).json({ message: "All groups", result });
          })
          .catch((err) => {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Error occured" });
          });
      },

    async GetGroup(req, res) {
        await Group.findOne({ _id: req.params.id })
        .populate("creatorId")
        .populate("members.userId")
          .then((result) => {
            res.status(httpStatus.OK).json({ message: "Group by id", result });
          })
          .catch((err) => {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Error occured" });
          });
      },

    async AddGroup (req, res) {

        const schema = Joi.object().keys({
               group: Joi.string().required()
          });

        const { error } = schema.validate(req.body.post);

        if (error && error.details) {
          return res.status(httpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        const groupName = await Group.findOne({
          groupname: Helpers.firstUpper(req.body.group),
        });
        if (groupName) {
          return res
            .status(httpStatus.CONFLICT)
            .json({ message: "Group Name already exist" });
        }

        const body = {
            creatorId:req.user._id,
            creatorname: req.user.username,
            groupname:  Helpers.firstUpper(req.body.group),
            description:req.body.description,
            members: req.body.members,
            createdAt: new Date(),
          };
    
          Group.create(body)
          .then(async (group) => {

            for (i = 0; i < req.body.members.length ; i++){
              // console.log(req.body.members[i])

              await User.update(
                {
                  _id: req.body.members[i].userId,
                },
                {
                  $push: {
                    groups: {
                      groupId: group._id,
                      groupname: req.body.group,
                      created: new Date(),
                    },
                  },
                }
              );

            }
            

            res.status(httpStatus.OK).json({ message: "Group created", group });
          })
          .catch((err) =>
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occurred while creating group" })
        );

    },

    EditGroup(req, res){

      const schema = Joi.object().keys({
        groupname: Joi.string().required(),
        description: Joi.string().required(),
        id: Joi.string().optional()
      });
  
      const { error } = schema.validate(req.body);
  
      if (error && error.details) {
        return res.status(httpStatus.BAD_REQUEST).json({ msg: error.details });
      }
  
      
      const body = {
        groupname: req.body.groupname,
        description: req.body.description,
        // members: req.body.members,
        created: new Date(),
      }
  
      Group.findOneAndUpdate({_id: req.body.id}, body, {new: true}).then(groupname => {
        res.status(httpStatus.OK).json({ message: "Groupname updated successful" , groupname})
      }).catch(err => {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
      })
    },

    async DeleteGroup(req, res){

      console.log(req.params)
      try{
  
        const {id} = req.params;
        const result = await Group.findByIdAndRemove(id);
        
        if(!result){
          return res.status(httpStatus.NOT_FOUND).json({ message:"Could not delete group"})
        } else {

          console.log(result)
          for (i = 0; i < result.members.length ; i++){

                await User.update({ 
                   _id:result.members[i].userId
                }, { 
                     $pull: {groups: {
                            groupId: result._id
                     }}
                 });

          }
          // await User.update({ 
          //   _id:req.group._id
          // }, { 
          //   $pull: {groups: {
          //     groupId: result._id
          //   }}
          // });

          return res.status(httpStatus.OK).json({ message: "Group deleted successfully"})
        }

        // for (i = 0; i < req.body.members.length ; i++){
        //   console.log(req.body.members[i])

        //   await User.update(
        //     {
        //       _id: req.body.members[i].userId,
        //     },
        //     {
        //       $push: {
        //         groups: {
        //           groupId: group._id,
        //           groupname: req.body.group,
        //           created: new Date(),
        //         },
        //       },
        //     }
        //   );

        // }
  
  
      } catch(err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
      }
  
    } 
}


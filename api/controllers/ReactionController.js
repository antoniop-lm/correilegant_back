/**
 * ReactionController
 *
 * @description :: Server-side logic for managing Reaction
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  set_reaction: function (req, res) {
    /*
      Requisitos: Estar logado
      Paramêtros: tweet, rate
      Saida: -

      Cria uma reaction para o usuário logado para um tweet passado como parâmetro.
      Para rate = 1, o reaction é positivo.
      Para rate = 0, o reaction é negativo.
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Tweet.findOne({id: data.tweet}).exec(function(err, result_tweet){
          if(err) throw err;
          if(result_tweet){
            Reaction.findOne({tweet: result_tweet.id, user: data.user}).exec(function(err, result_reaction){
              //console.log(result_reaction);
              if(result_reaction != null) {
                if(result_reaction.rate == data.rate){
                  Reaction.destroy({where: {user: data.user, tweet: result_tweet.id}}).exec(function(err){
                    if(err) throw err;
                    context.status = 'success';
                    return res.json(context);
                  });
                } else {
                  Reaction.update(result_reaction.id, data).exec(function (err, updated){
                    if(err) throw err;
                    context.status = 'success';
                    return res.json(context);
                  });
                }
              } else { 
                Reaction.create(data).exec(function(err, created){
                  if(err) throw err;
                  context.status = 'success';
                  return res.json(context);
                });
              }
            });
          }
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  my_reaction: function (req, res) {
    /*
      Requisitos: Estar logado
      Paramêtros: tweet
      Saida: Retorna uma reaction

      Busca para um "tweet" passado como parâmetro, o reaction do usuário logado.
    */
    var context = {};
    context.status = 'error';

    var data = (req.params) ? req.params : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.findOne({where: {user: data.user, tweet: data.id}}).exec(function(err, found){
          context.found = found;
          if(err) throw err;
            context.status = 'success';
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};

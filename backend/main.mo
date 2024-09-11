import Func "mo:base/Func";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import List "mo:base/List";

actor {
  // Define the structure for a blog post
  type Post = {
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  // Store posts in a stable variable
  stable var posts : List.List<Post> = List.nil();

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Text) : async () {
    let newPost : Post = {
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(newPost, posts);
  };

  // Function to get all posts, sorted by most recent
  public query func getPosts() : async [Post] {
    let sortedPosts = List.toArray(posts);
    Array.sort(sortedPosts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };
}